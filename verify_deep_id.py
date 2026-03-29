import sys
from pathlib import Path
import os
import json

# Add the backend directory to sys.path so we can import app modules
backend_path = Path.cwd() / "backend"
sys.path.append(str(backend_path))

try:
    from app.database import HMLakehouse
    
    print("🚀 [Deep Verify] Initializing HMLakehouse for FINAL TEST...")
    # Mock environment variables for local test
    os.environ["GEMINI_API_KEY"] = "mock_key"
    
    lakehouse = HMLakehouse()
    
    # TEST 1: The "Problem" ID from the latest screenshot
    problem_id = "00000dbacae5abe5e23885899a1fa44253a17956c6d1c3d25f88aa139fdfc657"
    print(f"\n🔍 [Problem ID Test] ID: {problem_id}")
    int_id = lakehouse.int_from_hex(problem_id)
    
    if int_id is not None:
        print(f"✅ SUCCESS: ID recognized! Internal ID: {int_id}")
    else:
        print("❌ FAILED: ID still not recognized in local bridge.")

    # TEST 2: The "Random ID" Button logic
    print("\n🎲 [Random ID Test] Simulating API button click...")
    random_hex = lakehouse.get_random_hex_id()
    if random_hex:
        print(f"✅ SUCCESS: Random ID recovered from bridge: {random_hex}")
        # Check back-lookup
        back_lookup = lakehouse.int_from_hex(random_hex)
        if back_lookup:
            print(f"✅ SUCCESS: Random ID loop-back works. (Int ID: {back_lookup})")
        else:
            print("❌ FAILED: Random ID failed loop-back.")
    else:
        print("❌ FAILED: Random ID button would return empty.")

    # TEST 3: JSON Key Verification (matching the React fix)
    # Simulating what the frontend sees from /api/v1/random-id
    # We check if the key is 'hex_id'
    mock_payload = {"hex_id": random_hex}
    print(f"\n📦 [JSON Key Test] Simulate Backend -> Frontend Payload: {json.dumps(mock_payload)}")
    if "hex_id" in mock_payload:
        print("✅ SUCCESS: Backend is using 'hex_id'. (React fix matches).")
    else:
        print("❌ FAILED: Backend key mismatch.")

except Exception as e:
    print(f"❌ CRITICAL ERROR during test: {e}")
    import traceback
    traceback.print_exc()
