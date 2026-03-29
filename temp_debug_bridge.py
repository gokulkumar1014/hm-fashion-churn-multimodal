import duckdb
from pathlib import Path
import os
import sys

# Adjust path based on where script runs
cwd = Path.cwd()
assets_dir = cwd / "backend" / "assets"
bridge_path = str((assets_dir / "customer_id_bridge.parquet").resolve()).replace("\\", "/")

print(f"Checking path: {bridge_path}")
if not os.path.exists(bridge_path):
    print(f"❌ FILE NOT FOUND at {bridge_path}")
else:
    print(f"✅ File exists at {bridge_path}")

conn = duckdb.connect(':memory:')
try:
    conn.execute(f"CREATE TABLE bridge AS SELECT * FROM read_parquet('{bridge_path}')")
    print("✅ Table bridge created.")
    
    # Check top 5
    rows = conn.execute("SELECT hex_id, int_id FROM bridge LIMIT 5").fetchall()
    print("Top 5 rows:")
    for row in rows:
        print(f"  {row[0]} -> {row[1]}")
    
    # Check the specific ID from user image
    target_id = "000058a12d5b43e67d225668fa1f8d618c13dc232df0cad8ffe7ad4a1091e318"
    exists = conn.execute("SELECT int_id FROM bridge WHERE hex_id = ?", [target_id]).fetchone()
    print(f"Target ID {target_id} exists: {exists}")

    target_id_2 = "3bf3c34b60f6df8fad0be6ed566ae8c27bce03945acb072577b2d7548df4b174"
    exists_2 = conn.execute("SELECT int_id FROM bridge WHERE hex_id = ?", [target_id_2]).fetchone()
    print(f"Target ID {target_id_2} exists: {exists_2}")

except Exception as e:
    print(f"❌ Error during query: {e}")
    import traceback
    traceback.print_exc()
