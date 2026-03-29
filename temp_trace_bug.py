"""
Traces the EXACT path a hex ID takes through the backend logic.
Simulates what happens when the chat endpoint receives a hex ID.
"""
import re
import duckdb
from pathlib import Path

# --- Simulate main.py regex ---
HEX_PATTERN = re.compile(r'\b[a-fA-F0-9]{40,64}\b')

# Test IDs
test_hex = "00000dbacae5abe5e23885899a1fa44253a17956c6d1c3d25f88aa139fdfc657"
test_message_paste = test_hex  # user pasting just the ID
test_message_sentence = f"analyze {test_hex} please"  # user typing around it

print("=" * 60)
print("BUG TRACE 1: Regex Extraction")
print("=" * 60)

for label, msg in [("Pure paste", test_message_paste), ("In sentence", test_message_sentence)]:
    hex_match = HEX_PATTERN.search(msg)
    int_match = re.search(r'\b\d{5,15}\b', msg)
    if hex_match:
        extracted = hex_match.group(0)
        print(f"  [{label}] HEX MATCH: '{extracted}' (len={len(extracted)})")
    elif int_match:
        extracted = int_match.group(0)
        print(f"  [{label}] INT MATCH: '{extracted}'")
    else:
        print(f"  [{label}] NO MATCH -> would fall to general chat!")

print()
print("=" * 60)
print("BUG TRACE 2: Bridge Lookup (int_from_hex simulation)")
print("=" * 60)

assets = Path.cwd() / "backend" / "assets"
bridge_path = str((assets / "customer_id_bridge.parquet").resolve()).replace("\\", "/")
bio_path = str((assets / "customer_bio.parquet").resolve()).replace("\\", "/")
stats_path = str((assets / "customer_stats.parquet").resolve()).replace("\\", "/")

conn = duckdb.connect(":memory:")
conn.execute(f"CREATE VIEW customer_id_bridge AS SELECT * FROM read_parquet('{bridge_path}')")
conn.execute(f"CREATE VIEW customer_bio AS SELECT * FROM read_parquet('{bio_path}')")
conn.execute(f"CREATE VIEW customer_stats AS SELECT * FROM read_parquet('{stats_path}')")

# Step 1: clean the ID (services.py line 309)
clean_id = ''.join(e for e in test_hex if e.isalnum())
print(f"  clean_id: '{clean_id}' (len={len(clean_id)})")

# Step 2: Is it digit? No, it's hex
print(f"  Is digit? {clean_id.isdigit()}")

# Step 3: So hex_target = clean_id
hex_target = clean_id
print(f"  hex_target: '{hex_target}'")

# Step 4: Simulate int_from_hex
id_clean = hex_target.strip().lower()
print(f"  id_clean for lookup: '{id_clean}' (len={len(id_clean)})")

# Exact match
row = conn.execute(
    "SELECT int_id FROM customer_id_bridge WHERE lower(hex_id) = ? LIMIT 1",
    [id_clean]
).fetchone()
if row:
    print(f"  ✅ EXACT MATCH FOUND: int_id = {row[0]}")
else:
    print(f"  ❌ EXACT MATCH FAILED")
    
    # Truncated prefix (for > 40 chars)
    if len(id_clean) > 40:
        truncated = id_clean[:40]
        print(f"  Trying truncated prefix: '{truncated}'")
        row2 = conn.execute(
            "SELECT int_id FROM customer_id_bridge WHERE lower(hex_id) = ? LIMIT 1",
            [truncated]
        ).fetchone()
        if row2:
            print(f"  ✅ PREFIX MATCH FOUND: int_id = {row2[0]}")
        else:
            print(f"  ❌ PREFIX MATCH ALSO FAILED")

# Step 5: Test get_customer_context with LIKE pattern
print()
print("=" * 60)
print("BUG TRACE 3: Bio/Stats LIKE lookup")
print("=" * 60)

if row:
    int_id = row[0]
    # Simulate hex_from_int (reverse lookup)
    hex_row = conn.execute(
        "SELECT hex_id FROM customer_id_bridge WHERE int_id = ? LIMIT 1",
        [int_id]
    ).fetchone()
    bridge_hex = hex_row[0] if hex_row else None
    print(f"  Bridge hex_id: '{bridge_hex}' (len={len(bridge_hex) if bridge_hex else 0})")
    
    # Now check bio with LIKE
    bio_row = conn.execute(
        "SELECT customer_id, age, club_member_status FROM customer_bio WHERE customer_id LIKE ? LIMIT 1",
        [f"{bridge_hex}%"]
    ).fetchone()
    if bio_row:
        print(f"  ✅ Bio FOUND: customer_id='{bio_row[0][:20]}...' age={bio_row[1]} status={bio_row[2]}")
    else:
        print(f"  ❌ Bio NOT FOUND with LIKE '{bridge_hex}%'")

print()
print("=" * 60)
print("BUG TRACE 4: Random ID simulation")
print("=" * 60)
try:
    random_row = conn.execute(
        "SELECT hex_id FROM customer_id_bridge LIMIT 1 OFFSET (SELECT CAST(RANDOM() * COUNT(*) AS INT) FROM customer_id_bridge)"
    ).fetchone()
    if random_row:
        random_hex = random_row[0]
        print(f"  ✅ Random hex: '{random_hex}' (len={len(random_hex)})")
        # Now check if the regex would match it
        match = HEX_PATTERN.search(random_hex)
        print(f"  Regex match on random hex: {'✅ YES' if match else '❌ NO'}")
    else:
        print(f"  ❌ Random ID query returned None")
except Exception as e:
    print(f"  ❌ Random ID query FAILED: {e}")
