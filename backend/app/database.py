import os
from pathlib import Path
import polars as pl
import onnxruntime as ort
import numpy as np
from functools import lru_cache
import sys
from dotenv import load_dotenv

load_dotenv()

class HMLakehouse:
    _instance = None

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
