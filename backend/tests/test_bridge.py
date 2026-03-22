import polars as pl
from pathlib import Path

df = pl.read_parquet("assets/customer_id_bridge.parquet").limit(1)
print(df.columns)
print(df.schema)
print(df.to_dicts())
