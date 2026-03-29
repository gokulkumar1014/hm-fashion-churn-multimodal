import duckdb
from pathlib import Path

cwd = Path.cwd()
bridge_path = str((cwd / "backend" / "assets" / "customer_id_bridge.parquet").resolve()).replace("\\", "/")

conn = duckdb.connect(':memory:')
try:
    conn.execute(f"CREATE TABLE bridge AS SELECT * FROM read_parquet('{bridge_path}')")
    
    # Let's see the EXACT content of a few rows
    rows = conn.execute("SELECT hex_id, length(hex_id) FROM bridge LIMIT 5").fetchall()
    print("Bridge Samples:")
    for row in rows:
        print(f"  ID: '{row[0]}' (Length: {row[1]})")

except Exception as e:
    print(f"Error: {e}")
