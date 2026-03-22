import polars as pl
from pathlib import Path

df = pl.read_parquet("assets/customer_stats.parquet").limit(1)
print(df["customer_id"][0], type(df["customer_id"][0]))
