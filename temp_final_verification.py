import duckdb
from pathlib import Path
import os

cwd = Path.cwd()
assets_dir = cwd / "backend" / "assets"
bridge_path = str((assets_dir / "customer_id_bridge.parquet").resolve()).replace("\\", "/")
hist_path = str((assets_dir / "history_narrative.parquet").resolve()).replace("\\", "/")

conn = duckdb.connect(':memory:')
try:
    conn.execute(f"CREATE TABLE bridge AS SELECT * FROM read_parquet('{bridge_path}')")
    conn.execute(f"CREATE TABLE history AS SELECT * FROM read_parquet('{hist_path}')")
    
    # 1. Test 64-char ID -> 40-char Bridge Lookup (The Weld)
    target_64 = "000058a12d5b43e67d225668fa1f8d618c13dc232df0cad8ffe7ad4a1091e318"
    truncated = target_64[:40]
    int_id = conn.execute("SELECT int_id FROM bridge WHERE hex_id = ?", [truncated]).fetchone()
    print(f"Step 1: 64-char ID -> Int ID (via 40-char bridge): {int_id}")
    
    # 2. Test 40-char ID -> 64-char Data Lookup (The Reverse Weld)
    # Using the truncated ID to find history in the 64-char table
    hist_count = conn.execute("SELECT count(*) FROM history WHERE customer_id LIKE ?", [f"{truncated}%"]).fetchone()
    print(f"Step 2: 40-char prefix -> 64-char History count: {hist_count}")

except Exception as e:
    print(f"Error: {e}")
