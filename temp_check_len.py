import duckdb
from pathlib import Path

p = str((Path.cwd() / "backend" / "assets" / "customer_id_bridge.parquet").resolve()).replace("\\", "/")
conn = duckdb.connect(":memory:")
conn.execute(f"CREATE VIEW bridge AS SELECT * FROM read_parquet('{p}')")

dist = conn.execute("SELECT length(hex_id) as l, count(*) FROM bridge GROUP BY 1 ORDER BY 1").fetchall()
print("=== Hex ID Length Distribution ===")
for l, c in dist:
    print(f"  Length {l}: {c} rows")

rows = conn.execute("SELECT hex_id FROM bridge LIMIT 5").fetchall()
print("\n=== Sample Hex IDs ===")
for r in rows:
    print(f"  '{r[0]}'")
