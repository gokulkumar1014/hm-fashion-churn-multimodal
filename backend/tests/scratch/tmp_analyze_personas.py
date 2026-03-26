import polars as pl
import json
from pathlib import Path

# Paths to the data
base_dir = Path(r"c:\Users\Gokul Kumar Kesavan\.gemini\antigravity\scratch\hm-fashion-churn-multimodal\backend\assets")
persona_bs_path = base_dir / "persona_best_sellers.parquet"
article_legend_path = base_dir / "article_legend.parquet"

# Load data
pbs = pl.read_parquet(persona_bs_path)
al = pl.read_parquet(article_legend_path)

pbs = pbs.with_columns(pl.col("article_id").cast(pl.String).str.zfill(10).alias("article_id_str"))
al = al.with_columns(pl.col("article_id").cast(pl.String).str.zfill(10).alias("article_id_str"))

joined = pbs.join(al, on="article_id_str", how="inner")

output = {}
for p_id in sorted(joined["style_persona"].unique().to_list()):
    cluster_df = joined.filter(pl.col("style_persona") == p_id).sort("count", descending=True).head(5)
    output[str(p_id)] = [
        f"{row.get('product_type_name', 'Unknown')} | {row.get('product_group_name', 'Unknown')} | {row.get('department_name', 'Unknown')} | {row.get('prod_name', 'Unknown')} ({row.get('colour_group_name', 'Unknown')})"
        for row in cluster_df.to_dicts()
    ]

with open("tmp_personas.json", "w") as f:
    json.dump(output, f, indent=2)
