import polars as pl
from pathlib import Path

base_dir = Path(r"c:\Users\Gokul Kumar Kesavan\.gemini\antigravity\scratch\hm-fashion-churn-multimodal\backend\assets")

print("Loading data...")
customer_stats = pl.read_parquet(base_dir / "customer_stats.parquet")
print(customer_stats.head())

# Calculate Global Risk based on total_purchases < 2 or last_purchase being old?
# Actually, since ONNX churn is ~50% baseline, we can just proxy global churn by filtering LTV < 50 or frequency <=1
print(f"Total customers: {len(customer_stats)}")
high_risk = customer_stats.filter(pl.col("total_purchases") <= 2)
global_risk_pct = (len(high_risk) / len(customer_stats)) * 100
print(f"Proxy Global Risk (Purchases <= 2): {global_risk_pct:.2f}%")

history = pl.read_parquet(base_dir / "history_narrative.parquet")
article_legend = pl.read_parquet(base_dir / "article_legend.parquet")

# Market Velocity
print("Joining history with article_legend...")
# cast article_ids to match
history = history.with_columns(pl.col("article_id").cast(pl.String).str.zfill(10).alias("article_id_str"))
article_legend = article_legend.with_columns(pl.col("article_id").cast(pl.String).str.zfill(10).alias("article_id_str"))

recent_activity = history.join(article_legend, on="article_id_str", how="inner")
top_velocity = recent_activity["product_type_name"].value_counts().sort("count", descending=True).head(1)
if len(top_velocity) > 0:
    print(f"Top Velocity Category: {top_velocity['product_type_name'][0]}")

# Top Persona (need to join style_profiles with stats)
# style profiles is in GCS, I will simulate it based on persona_best_sellers logic or just hard code for the test script.

print("Done")
