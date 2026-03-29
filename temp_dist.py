import duckdb
from pathlib import Path

cwd = Path.cwd()
bridge_path = str((cwd / "backend" / "assets" / "customer_id_bridge.parquet").resolve()).replace("\\", "/")

conn = duckdb.connect(':memory:')
try:
    conn.execute(f"CREATE VIEW bridge AS SELECT * FROM read_parquet('{bridge_path}')")
    
    # Check length distribution
    dist = conn.execute("SELECT length(hex_id) as l, count(*) FROM bridge GROUP BY 1 ORDER BY 1").fetchall()
    print("Length Distribution:")
    for l, count in dist:
        print(f"  Length {l}: {count} rows")

except Exception as e:
    print(f"Error: {e}")
