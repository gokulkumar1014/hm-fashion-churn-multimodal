import polars as pl
from pathlib import Path

pl.Config.set_tbl_rows(-1)
pl.Config.set_tbl_cols(-1)

base_dir = Path(r"c:\Users\Gokul Kumar Kesavan\.gemini\antigravity\scratch\hm-fashion-churn-multimodal\backend\assets")
pbs = pl.read_parquet(base_dir / "persona_best_sellers.parquet")
al = pl.read_parquet(base_dir / "article_legend.parquet")

pbs_str = pbs.with_columns(pl.col("article_id").cast(pl.String).str.zfill(10).alias("article_id_str"))
al_str = al.with_columns(pl.col("article_id").cast(pl.String).str.zfill(10).alias("article_id_str"))

joined = pbs_str.join(al_str, on="article_id_str", how="left")
joined_clean = joined.select(["style_persona", "article_id", "count", "prod_name", "product_type_name", "colour_group_name"])

with open("tmp_show_output.txt", "w", encoding="utf-8") as f:
    f.write("## 1. persona_best_sellers.parquet (Raw 50 Rows)\n```text\n")
    f.write(str(pbs))
    f.write("\n```\n\n## 2. Left Join Result\n```text\n")
    f.write(str(joined_clean))
    f.write("\n```")
