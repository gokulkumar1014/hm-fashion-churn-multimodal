import polars as pl
from dotenv import load_dotenv

load_dotenv()
try:
    df = pl.scan_parquet("gs://gokul-hm-vault/customer_style_profiles_final.parquet").limit(1).collect()
    print("Columns:", df.columns)
    print("Schema:", dict(df.schema))
except Exception as e:
    print("CRASH:", e)
