import polars as pl
from pathlib import Path

base_dir = Path(r"c:\Users\Gokul Kumar Kesavan\.gemini\antigravity\scratch\hm-fashion-churn-multimodal\backend\assets")
pbs = pl.read_parquet(base_dir / "persona_best_sellers.parquet")
print(f"Total rows in persona_best_sellers: {len(pbs)}")
