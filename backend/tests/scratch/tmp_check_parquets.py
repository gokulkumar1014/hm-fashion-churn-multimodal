import polars as pl
from pathlib import Path

base_dir = Path(r"c:\Users\Gokul Kumar Kesavan\.gemini\antigravity\scratch\hm-fashion-churn-multimodal\backend\assets")

files = [
    "customer_stats.parquet",
    "customer_bio.parquet", 
    "history_narrative.parquet",
    "persona_best_sellers.parquet"
]

with open("tmp_parquet_cols.txt", "w") as f:
    for file in files:
        try:
            df = pl.read_parquet(base_dir / file)
            f.write(f"\n=== {file} ===\n")
            f.write(f"Columns: {df.columns}\n")
            f.write(f"Sample:\n{df.head(1)}\n")
        except Exception as e:
            f.write(f"\n=== {file} ===\nERROR: {e}\n")
