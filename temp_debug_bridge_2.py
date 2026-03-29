import duckdb
from pathlib import Path
import os

cwd = Path.cwd()
bridge_path = str((cwd / "backend" / "assets" / "customer_id_bridge.parquet").resolve()).replace("\\", "/")

conn = duckdb.connect(':memory:')
try:
    conn.execute(f"CREATE TABLE bridge AS SELECT * FROM read_parquet('{bridge_path}')")
    
    print("Schema:")
    print(conn.execute("DESCRIBE bridge").fetchall())
    
    print("\nFirst row:")
    print(conn.execute("SELECT * FROM bridge LIMIT 1").fetchone())
    
    target_id = "000058a12d5b43e67d225668fa1f8d618c13dc232df0cad8ffe7ad4a1091e318"
    exists = conn.execute("SELECT int_id FROM bridge WHERE hex_id = ?", [target_id]).fetchone()
    print(f"\nTarget ID {target_id} result: {exists}")
    
    # Try a LIKE search in case of padding
    like_res = conn.execute("SELECT hex_id, int_id FROM bridge WHERE hex_id LIKE '000058a12d5b%' LIMIT 1").fetchone()
    print(f"LIKE search result: {like_res}")

except Exception as e:
    print(f"Error: {e}")
