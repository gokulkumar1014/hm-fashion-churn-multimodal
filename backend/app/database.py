from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional

import duckdb
import numpy as np
import onnxruntime as ort
import polars as pl
from dotenv import load_dotenv

load_dotenv()


class HMLakehouse:
    _instance = None

    LOCAL_VIEWS = {
        "article_legend": "article_legend.parquet",
        "customer_bio": "customer_bio.parquet",
        "customer_stats": "customer_stats.parquet",
        "history_narrative": "history_narrative.parquet",
        "persona_best_sellers": "persona_best_sellers.parquet",
        "similarity_index": "similarity_index.parquet",
        "customer_id_bridge": "customer_id_bridge.parquet",
    }

    REMOTE_VIEWS = {
        "style_profiles": "gs://gokul-hm-vault/customer_style_profiles_final.parquet",
        "hm_style_encyclopedia": "gs://gokul-hm-vault/hm_style_encyclopedia.parquet",
        "behavioral_sequences": "gs://gokul-hm-vault/behavioral_sequences.parquet",
    }

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HMLakehouse, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        base_dir = Path(__file__).resolve().parent.parent
        assets_dir = base_dir / "assets"
        self.duckdb_conn = duckdb.connect(database=":memory:")

        for view_name, filename in self.LOCAL_VIEWS.items():
            absolute_path = str((assets_dir / filename).resolve()).replace("\\", "/")
            self.duckdb_conn.execute(
                f"CREATE VIEW IF NOT EXISTS {view_name} AS SELECT * FROM read_parquet('{absolute_path}')"
            )

        # 🚨 PROD LATENCY CURE v2: Download natively to disk (/tmp) to prevent RAM blowout, then scan locally.
        from google.cloud import storage
        import os
        try:
            storage_client = storage.Client()
            bucket = storage_client.bucket("gokul-hm-vault")
        except Exception:
            storage_client = None

        self.remote_dfs = {}
        for view, uri in self.REMOTE_VIEWS.items():
            blob_name = uri.split("gokul-hm-vault/")[-1]
            tmp_path = f"/tmp/{blob_name}"
            # Only download if it doesn't already exist locally
            if not os.path.exists(tmp_path) and storage_client:
                print(f"Downloading {blob_name} natively to ephemeral disk...")
                blob = bucket.blob(blob_name)
                blob.download_to_filename(tmp_path)
            
            # If download succeeded (or local laptop), scan the local file! If it failed, fallback to network.
            if os.path.exists(tmp_path):
                self.remote_dfs[view] = pl.scan_parquet(tmp_path)
            else:
                self.remote_dfs[view] = pl.scan_parquet(uri)

        onnx_model_path = assets_dir / "visionary_champion_quantized.onnx"
        
        # 🚨 PROD FIX: Constrain ONNX threads so it doesn't suffocate Cloud Run's CPU
        options = ort.SessionOptions()
        options.intra_op_num_threads = 1
        options.inter_op_num_threads = 1
        
        self.visionary_champion = ort.InferenceSession(str(onnx_model_path), options)
        self.global_pulse_stats = self._compute_global_pulse()

    def _fetch_dicts(
        self,
        query: str,
        params: Optional[List[Any]] = None,
        table: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        if table in self.remote_dfs:
            raise ValueError("Remote queries must use remote helpers with filters.")
        params = params or []
        result = self.duckdb_conn.execute(query, params)
        columns = [col[0] for col in result.description]
        return [dict(zip(columns, row)) for row in result.fetchall()]

    def _fetch_one(
        self,
        query: str,
        params: Optional[List[Any]] = None,
        table: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        rows = self._fetch_dicts(query, params, table=table)
        return rows[0] if rows else None

    def _fetch_remote(
        self,
        table: str,
        filters: Optional[Dict[str, Any]] = None,
        select: Optional[List[str]] = None,
        order_by: Optional[str] = None,
        descending: bool = True,
        limit: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        df = self.remote_dfs.get(table)
        if df is None:
            return []
        filters = filters or {}
        for column, value in filters.items():
            df = df.filter(pl.col(column) == value)
        if select:
            df = df.select(select)
        if order_by:
            df = df.sort(order_by, descending=descending)
        if limit:
            df = df.limit(limit)
            
        # 🚨 MASSIVE PROD FIX: Enforce streaming to prevent 503 Out-of-Memory crashes
        collected = df.collect(streaming=True)
        return collected.to_dicts()

    def _compute_global_pulse(self) -> dict:
        try:
            velocity_rows = self._fetch_dicts(
                """
                    SELECT a.product_type_name, COUNT(*) AS cnt
                    FROM history_narrative h
                    JOIN article_legend a ON h.article_id = a.article_id
                    GROUP BY a.product_type_name
                    ORDER BY cnt DESC
                    LIMIT 3
                """
            )
            velocity_counts = [row["cnt"] for row in velocity_rows]
            ticker_category = velocity_rows[0]["product_type_name"] if velocity_rows else "Knitwear"
            formatted_velocity = "+0%"
            if velocity_counts:
                mean_count = sum(velocity_counts) / len(velocity_counts)
                velocity_pct = round(((velocity_counts[0] / mean_count) - 1) * 100) if mean_count else 0
                formatted_velocity = f"+{int(velocity_pct)}%"

            style_df = (
                self.remote_dfs["style_profiles"]
                .group_by("style_persona")
                .agg(pl.count().alias("cnt"))
                .sort("cnt", descending=True)
                .limit(3)
                .collect()
            )
            top_persona_data = [
                {"id": int(row["style_persona"]), "count": int(row["cnt"])}
                for row in style_df.iter_rows(named=True)
            ] or [{"id": 0, "count": 0}]

            sampled_drift = 0.38
            return {
                "global_drift": sampled_drift,
                "high_risk_percentage": float(f"{((408499 / 1362281) * 0.88 * 100):.1f}"),
                "ticker_category": ticker_category,
                "market_velocity_pct": formatted_velocity,
                "market_velocity_data": velocity_rows or [{"name": "Knitwear", "count": 0}],
                "top_persona_data": top_persona_data,
            }
        except Exception as exc:
            print(f"⚠️ [Pulse Aggregator] Failed to compute static aggregates: {exc}")
            return {
                "global_drift": 0.38,
                "high_risk_percentage": 26.4,
                "market_velocity_category": "Trousers",
                "market_velocity_pct": "+12%",
                "top_persona_id": 0,
            }

    def hex_from_int(self, int_id: int) -> Optional[str]:
        row = self._fetch_one(
            "SELECT hex_id FROM customer_id_bridge WHERE int_id = ? LIMIT 1",
            [int_id],
        )
        return row["hex_id"] if row else None

    def int_from_hex(self, hex_id: str) -> Optional[int]:
        row = self._fetch_one(
            "SELECT int_id FROM customer_id_bridge WHERE hex_id = ? LIMIT 1",
            [hex_id],
        )
        return int(row["int_id"]) if row else None

    @lru_cache(maxsize=1000)
    def get_customer_context(self, int_id: int) -> dict:
        hex_id = self.hex_from_int(int_id)
        if not hex_id:
            return {"error": f"Customer int_id {int_id} not found in bridge."}

        row = self._fetch_one(
            """
            SELECT
                b.customer_id,
                b.age,
                b.club_member_status,
                s.last_purchase,
                s.estimated_ltv,
                s.total_purchases
            FROM customer_bio b
            LEFT JOIN customer_stats s ON b.customer_id = s.customer_id
            WHERE b.customer_id = ?
            LIMIT 1
        """,
            [hex_id],
        )
        if not row:
            return {"error": f"Customer ID {hex_id} not found locally."}

        dna_row = self._fetch_remote(
            "style_profiles",
            filters={"customer_id": int_id},
            select=["customer_style_dna", "style_persona"],
            limit=1,
        )
        return {
            "customer_id": int_id,
            "hex_id": hex_id,
            "local_bio_stats": {
                "customer_id": row["customer_id"],
                "age": row["age"],
                "club_member_status": row["club_member_status"],
                "last_purchase": row.get("last_purchase"),
                "estimated_ltv": float(row.get("estimated_ltv") or 0.0),
                "total_purchases": int(row.get("total_purchases") or 0),
            },
            "style_dna": dna_row[0] if dna_row else {},
        }

    @lru_cache(maxsize=1000)
    def calculate_style_drift(self, int_id: int) -> dict:
        hex_id = self.hex_from_int(int_id)
        if not hex_id:
            return {"error": f"Customer int_id {int_id} not found in bridge."}

        dna_rows = self._fetch_remote(
            "style_profiles",
            filters={"customer_id": int_id},
            select=["customer_style_dna"],
            limit=1,
        )
        if not dna_rows:
            return {"error": f"Customer ID {int_id} not found in remote style profiles."}

        cust_vector = np.array(dna_rows[0]["customer_style_dna"])

        history_rows = self._fetch_dicts(
            """
                SELECT article_id
                FROM history_narrative
                WHERE customer_id = ?
                ORDER BY t_dat DESC
                LIMIT 3
            """,
            [hex_id],
        )
        if not history_rows:
            return {"error": f"Customer ID {hex_id} has no purchase history to measure drift."}

        article_vectors = []
        article_ids = [int(row["article_id"]) for row in history_rows]
        for article_id in article_ids:
            padded_article_id = str(article_id).zfill(10)
            article_rows = self._fetch_remote(
                "hm_style_encyclopedia",
                filters={"article_id": padded_article_id},
                select=["style_embeddings"],
                limit=1,
            )
            if article_rows and article_rows[0].get("style_embeddings"):
                vec = np.array(article_rows[0]["style_embeddings"])
                if vec.size:
                    article_vectors.append(vec)

        if not article_vectors:
            return {"error": "Could not extract vectors from article DNA data."}

        mean_article_vector = np.mean(article_vectors, axis=0)
        if cust_vector.size == 0 or mean_article_vector.size == 0:
            return {"error": "Empty vector encountered."}

        cos_sim = np.dot(cust_vector, mean_article_vector) / (
            np.linalg.norm(cust_vector) * np.linalg.norm(mean_article_vector)
        )
        drift_score = float(1 - cos_sim)

        return {
            "customer_id": int_id,
            "drift_score": drift_score,
            "recent_articles": article_ids,
        }

    def _map_article_details(self, article_ints: list) -> list:
        if not article_ints:
            return []
        placeholders = ", ".join("?" for _ in article_ints)
        sql = f"SELECT * FROM article_legend WHERE article_id IN ({placeholders})"
        return self._fetch_dicts(sql, article_ints)

    def _get_historical_twins(self, hex_id: str) -> list:
        history = self._fetch_dicts(
            "SELECT article_id FROM history_narrative WHERE customer_id = ? LIMIT 1",
            [hex_id],
        )
        if not history:
            return []
        fav_article = int(history[0]["article_id"])
        fav_article_str = str(fav_article).zfill(10)
        twins = self._fetch_dicts(
            "SELECT similar_items FROM similarity_index WHERE article_id = CAST(? AS VARCHAR) LIMIT 1",
            [fav_article_str],
        )
        if not twins or "similar_items" not in twins[0]:
            return []
        return [int(x) for x in twins[0]["similar_items"][:3]]

    def _get_persona_best_sellers(self, int_id: int) -> list:
        persona = self._fetch_remote(
            "style_profiles",
            filters={"customer_id": int_id},
            select=["style_persona"],
            limit=1,
        )
        if not persona:
            return []
        best_sellers = self._fetch_dicts(
            "SELECT article_id FROM persona_best_sellers WHERE style_persona = ? LIMIT 3",
            [persona[0]["style_persona"]],
        )
        return [int(row["article_id"]) for row in best_sellers]

    def _get_recent_twins(self, padded_articles: list) -> list:
        if not padded_articles:
            return []
        last_article = int(padded_articles[0])
        last_article_str = str(last_article).zfill(10)
        twins = self._fetch_dicts(
            "SELECT similar_items FROM similarity_index WHERE article_id = CAST(? AS VARCHAR) LIMIT 1",
            [last_article_str],
        )
        if not twins or "similar_items" not in twins[0]:
            return []
        return [int(x) for x in twins[0]["similar_items"][:3]]


lakehouse = HMLakehouse()
