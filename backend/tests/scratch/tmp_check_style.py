import polars as pl
try:
    style_uri = "gs://gokul-hm-vault/customer_style_profiles_final.parquet"
    df = pl.read_parquet(style_uri)
    print("Columns in style profiles:")
    print(df.columns)
except Exception as e:
    print(f"Error: {e}")
