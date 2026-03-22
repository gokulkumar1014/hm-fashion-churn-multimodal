from app.database import lakehouse
import time
import sys

# Windows console emoji fix
sys.stdout.reconfigure(encoding='utf-8')

def test_system():
    # Use valid int_id = 0 which is '00000dbacae5abe5...'
    test_id = 0
    
    print(f"🛰️ Pinging Cloud Vault for Customer ID {test_id}...")
    
    start = time.time()
    # 1. Test Context Fetch
    context = lakehouse.get_customer_context(test_id)
    mid = time.time()
    
    # 2. Test Drift Math
    drift = lakehouse.calculate_style_drift(test_id)
    end = time.time()
    
    print("-" * 50)
    if "error" in context:
        print(f"❌ Context Error: {context['error']}")
    else:
        bio_stats = context.get('local_bio_stats', {})
        age = bio_stats.get('age', 'N/A')
        ltv = bio_stats.get('estimated_ltv', 0.0)
        try:
            print(f"✅ Context Found: Age {age}, Spend ${float(ltv):.2f}")
        except:
            print(f"✅ Context Found: Age {age}, Spend ${ltv}")
    
    if "error" in drift:
        print(f"❌ Drift Error: {drift['error']}")
    else:
        score = drift.get('drift_score', 0.0)
        print(f"🔥 Drift Score: {score:.4f}")
        print(f"🕵️ Logic: {'EVOLVING' if score > 0.4 else 'CONSISTENT'}")
    
    print("-" * 50)
    print(f"⏱️ Latency: Fetch Time {(mid-start):.2f}s, Math Time {(end-mid):.2f}s | Total {(end-start):.2f}s")
    print("-" * 50)

if __name__ == "__main__":
    test_system()
