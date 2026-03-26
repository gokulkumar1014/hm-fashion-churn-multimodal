import polars as pl
import os

try:
    history = pl.read_parquet('assets/history_narrative.parquet').with_columns(pl.col('article_id').cast(pl.String).str.zfill(10).alias('article_id_str'))
    legend = pl.read_parquet('assets/article_legend.parquet').with_columns(pl.col('article_id').cast(pl.String).str.zfill(10).alias('article_id_str'))
    recent = history.join(legend, on='article_id_str', how='inner')
    counts = recent['product_type_name'].value_counts().sort('count', descending=True).head(3)
    
    for row in counts.iter_rows():
        print(f"{row[0]}: {row[1]}")
except Exception as e:
    print(f"Extraction Error: {e}")
