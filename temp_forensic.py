import duckdb
from pathlib import Path

cwd = Path.cwd()
bridge_path = str((cwd / "backend" / "assets" / "customer_id_bridge.parquet").resolve()).replace("\\", "/")

conn = duckdb.connect(':memory:')
try:
    conn.execute(f"CREATE VIEW bridge AS SELECT * FROM read_parquet('{bridge_path}')")
    
    # Let's find IDs starting with '00000dbacae5abe5e23885899a1fa44253a17956'
    res = conn.execute("""
        SELECT hex_id, length(hex_id) 
        FROM bridge 
        WHERE hex_id LIKE '00000dbacae5abe5e23885899a1fa44253a17956%'
    """).fetchall()
    print("Matches found in bridge:")
    for row in res:
        print(f"  ID: '{row[0]}' (Length: {row[1]})")

except Exception as e:
    print(f"Error: {e}")
