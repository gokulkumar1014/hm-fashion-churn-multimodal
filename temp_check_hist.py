import duckdb
from pathlib import Path

cwd = Path.cwd()
hist_path = str((cwd / "backend" / "assets" / "history_narrative.parquet").resolve()).replace("\\", "/")

conn = duckdb.connect(':memory:')
try:
    print(conn.execute(f"SELECT length(customer_id) as l, count(*) FROM read_parquet('{hist_path}') GROUP BY 1").fetchall())
except Exception as e:
    print(f"Error: {e}")
