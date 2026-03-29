import sys
from pathlib import Path

# Add the backend directory to sys.path so we can import app modules
backend_path = Path.cwd() / "backend"
sys.path.append(str(backend_path))

try:
    from app.database import HMLakehouse
    import duckdb
    import os

    print("🚀 Initializing HMLakehouse locally for verification...")
    # Mock environment variables for local test
    os.environ["GEMINI_API_KEY"] = "mock_key"
    
    lakehouse = HMLakehouse()
    
    # Test 1: Standard 64-char ID (from user's screenshot)
    test_id_64 = "000058a12d5b43e67d225668fa1f8d618c13dc232df0cad8ffe7ad4a1091e318"
    print(f"\n🔍 Testing 64-char ID: {test_id_64}")
    int_id = lakehouse.int_from_hex(test_id_64)
    print(f"Resulting Int ID: {int_id}")
    
    if int_id is not None:
        print("✅ SUCCESS: 64-char ID recognized via Robust Weld.")
        # Test 2: Context Retrieval
        print("🔍 Testing Context Retrieval for this ID...")
        context = lakehouse.get_customer_context(int_id)
        if "error" not in context:
            print(f"✅ SUCCESS: Context retrieved (Age: {context.get('age')})")
        else:
            print(f"❌ FAILED: Context retrieval error: {context['error']}")
    else:
        print("❌ FAILED: 64-char ID not recognized.")

    # Test 3: Random ID Button simulation
    print("\n🎲 Testing Random ID Button simulation...")
    random_hex = lakehouse.get_random_hex_id()
    print(f"Random Hex from Bridge: {random_hex}")
    if random_hex:
        print(f"Length of random hex: {len(random_hex)}")
        # Verify if it can be looked back up
        back_lookup = lakehouse.int_from_hex(random_hex)
        print(f"Re-lookup Int ID: {back_lookup}")
        if back_lookup is not None:
             print("✅ SUCCESS: Random ID circular lookup passed.")
        else:
             print("❌ FAILED: Random ID could not be looked back up.")
    else:
        print("❌ FAILED: Could not get a random ID.")

except Exception as e:
    print(f"❌ CRITICAL ERROR during test: {e}")
    import traceback
    traceback.print_exc()
