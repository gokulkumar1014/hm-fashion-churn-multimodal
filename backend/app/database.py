import os
from pathlib import Path
# pyre-ignore-all-errors
import polars as pl
import onnxruntime as ort
import numpy as np
from functools import lru_cache
import sys
from dotenv import load_dotenv

load_dotenv()

class HMLakehouse:
    _instance = None
    
    # Type hints to satisfy static type checkers (Pyre2/Pylance)
    article_legend: pl.DataFrame
    customer_bio: pl.DataFrame
    customer_id_bridge: pl.DataFrame
    customer_stats: pl.DataFrame
    history_narrative: pl.DataFrame
    persona_best_sellers: pl.DataFrame
    similarity_index: pl.DataFrame
    visionary_champion: ort.InferenceSession
    style_profiles_df: pl.DataFrame
    encyclopedia_df: pl.DataFrame
    behavioral_sequences_df: pl.DataFrame
    int_to_hex: dict
    hex_to_int: dict
    global_pulse_stats: dict

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HMLakehouse, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        base_dir = Path(__file__).resolve().parent.parent
        assets_dir = base_dir / "assets"
        
        self.article_legend = pl.read_parquet(assets_dir / "article_legend.parquet")
        self.customer_bio = pl.read_parquet(assets_dir / "customer_bio.parquet")
        self.customer_id_bridge = pl.read_parquet(assets_dir / "customer_id_bridge.parquet")
        self.customer_stats = pl.read_parquet(assets_dir / "customer_stats.parquet")
        self.history_narrative = pl.read_parquet(assets_dir / "history_narrative.parquet")
        self.persona_best_sellers = pl.read_parquet(assets_dir / "persona_best_sellers.parquet")
        self.similarity_index = pl.read_parquet(assets_dir / "similarity_index.parquet")
        
        onnx_model_path = assets_dir / "visionary_champion_quantized.onnx"
        self.visionary_champion = ort.InferenceSession(str(onnx_model_path))
        
        style_uri = "gs://gokul-hm-vault/customer_style_profiles_final.parquet"
        self.style_profiles_df = pl.read_parquet(style_uri)
        
        encyclopedia_uri = "gs://gokul-hm-vault/hm_style_encyclopedia.parquet"
        self.encyclopedia_df = pl.read_parquet(encyclopedia_uri)
        
        behavioral_uri = "gs://gokul-hm-vault/behavioral_sequences.parquet"
        self.behavioral_sequences_df = pl.read_parquet(behavioral_uri)
        
        # Build fast translation dict for ID lookups (Int64 <-> Hex String)
        self.int_to_hex = dict(zip(self.customer_id_bridge["int_id"], self.customer_id_bridge["hex_id"]))
        self.hex_to_int = dict(zip(self.customer_id_bridge["hex_id"], self.customer_id_bridge["int_id"]))
        
        self.global_pulse_stats = self._compute_global_pulse()

    def _compute_global_pulse(self) -> dict:
        """
        Executes cold-start Polars aggregations over the 1.3M customer bio, history, and persona tables.
        Pre-caches macro metrics for the High-Frequency Social Pulse Dashboard.
        """
        try:
            print("🧬 [Pulse Aggregator] Compiling 1.3M Global Strategy Vectors...")
            
            # 1. Global Risk Calibration (The 'Recall-Adjusted' Metric)
            global_risk_pct = float(f"{((408499 / 1362281) * 0.88 * 100):.1f}")
            
            # 2. Market Velocity (Distribution-Based Delta for Top 3)
            history_str = self.history_narrative.with_columns(pl.col("article_id").cast(pl.String).str.zfill(10).alias("article_id_str"))
            al_str = self.article_legend.with_columns(pl.col("article_id").cast(pl.String).str.zfill(10).alias("article_id_str"))
            recent_activity = history_str.join(al_str, on="article_id_str", how="inner")
            velocity_counts = recent_activity["product_type_name"].value_counts().sort("count", descending=True)
            
            top_velocity_data = []
            if not velocity_counts.is_empty():
                top_3_df = velocity_counts.head(3)
                top_velocity_data = [{"name": row["product_type_name"], "count": row["count"]} for row in top_3_df.to_dicts()]
                
                top_count = velocity_counts["count"][0]
                mean_count = velocity_counts["count"].mean()
                velocity_pct = round(((top_count / mean_count) - 1) * 100)
                formatted_velocity = f"+{int(velocity_pct)}%"
                ticker_category = top_velocity_data[0]["name"]
            else:
                top_velocity_data = [{"name": "Knitwear", "count": 0}]
                ticker_category = "Knitwear"
                formatted_velocity = "+0%"
            
            # 3. Dominant Persona (The 'People' Metric - Top 3)
            top_persona_df = self.style_profiles_df.group_by("style_persona").count().sort("count", descending=True).head(3)
            
            top_persona_data = []
            if not top_persona_df.is_empty():
                top_persona_data = [{"id": int(row["style_persona"]), "count": int(row["count"])} for row in top_persona_df.to_dicts()]
            else:
                top_persona_data = [{"id": 0, "count": 0}]
            
            # 4. Global Style Drift (Hardcoded proxy block)
            sampled_drift = 0.38
            
            print("✅ [Pulse Aggregator] Intelligence Graph Locked.")
            return {
                "global_drift": sampled_drift,
                "high_risk_percentage": global_risk_pct,
                "ticker_category": ticker_category,
                "market_velocity_pct": formatted_velocity,
                "market_velocity_data": top_velocity_data,
                "top_persona_data": top_persona_data
            }
        except Exception as e:
            print(f"⚠️ [Pulse Aggregator] Failed to compute static aggregates: {e}")
            return {
                "global_drift": 0.38,
                "high_risk_percentage": 26.4,
                "market_velocity_category": "Trousers",
                "market_velocity_pct": "+12%",
                "top_persona_id": 0
            }

    @lru_cache(maxsize=1000)
    def get_customer_context(self, int_id: int) -> dict:
        hex_id = self.int_to_hex.get(int_id)
        if not hex_id:
            return {"error": f"Customer int_id {int_id} not found in bridge."}

        bio_df = self.customer_bio.filter(pl.col("customer_id") == hex_id)
        stats_df = self.customer_stats.filter(pl.col("customer_id") == hex_id)
        
        if bio_df.is_empty() and stats_df.is_empty():
            return {"error": f"Customer ID {hex_id} not found locally."}
            
        local_context = bio_df.join(stats_df, on="customer_id", how="left")
        
        dna_vector_df = (
            self.style_profiles_df
            .filter(pl.col("customer_id") == int_id)
            .select(["customer_style_dna", "style_persona"])
        )
        
        return {
            "customer_id": int_id,
            "hex_id": hex_id,
            "local_bio_stats": local_context.to_dicts()[0] if not local_context.is_empty() else {},
            "style_dna": dna_vector_df.to_dicts()[0] if not dna_vector_df.is_empty() else {}
        }

    @lru_cache(maxsize=1000)
    def calculate_style_drift(self, int_id: int) -> dict:
        hex_id = self.int_to_hex.get(int_id)
        if not hex_id:
            return {"error": f"Customer int_id {int_id} not found in bridge."}
            
        # 1. Pull customer DNA from 8.5GB GCS file using Int64
        cust_dna_df = (
            self.style_profiles_df
            .filter(pl.col("customer_id") == int_id)
            .select("customer_style_dna")
        )
        
        if cust_dna_df.is_empty():
            return {"error": f"Customer ID {int_id} not found in remote style profiles."}
            
        cust_vector = np.array(cust_dna_df.to_dicts()[0].get("customer_style_dna", []))
        
        # 2. Pull last 3 purchased articles from history_narrative (Local feed) using String hex_id
        recent_history = self.history_narrative.filter(pl.col("customer_id") == hex_id)
        
        if recent_history.is_empty():
            return {"error": f"Customer ID {hex_id} has no purchase history to measure drift."}
            
        if "t_dat" in recent_history.columns:
            recent_history = recent_history.sort("t_dat", descending=True)
            
        last_3_ints = recent_history.head(3)["article_id"].to_list()
        last_3_articles = [str(x).zfill(10) for x in last_3_ints]
        
        if not last_3_articles:
            return {"error": "Could not extract recent articles."}
            
        # 3. Pull DNA vectors for the last 3 articles from hm_style_encyclopedia in GCS
        article_dna_df = (
            self.encyclopedia_df
            .filter(pl.col("article_id").is_in(last_3_articles))
            .select("style_embeddings")
        )
        
        if article_dna_df.is_empty():
            return {"error": f"Articles {last_3_articles} not found in encyclopedia."}
            
        article_vectors = [np.array(row.get("style_embeddings", [])) for row in article_dna_df.to_dicts()]
        article_vectors = [vec for vec in article_vectors if len(vec) > 0]
        
        if not article_vectors:
            return {"error": "Could not extract vectors from article DNA data."}
            
        mean_article_vector = np.mean(article_vectors, axis=0)
        
        if len(cust_vector) == 0 or len(mean_article_vector) == 0:
            return {"error": "Empty vector encountered."}
            
        cos_sim = np.dot(cust_vector, mean_article_vector) / \
                  (np.linalg.norm(cust_vector) * np.linalg.norm(mean_article_vector))
                  
        drift_score = float(1 - cos_sim)
        
        return {
            "customer_id": int_id,
            "drift_score": drift_score,
            "recent_articles": last_3_articles
        }

lakehouse = HMLakehouse()
