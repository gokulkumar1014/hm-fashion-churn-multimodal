from app.services import conductor
import time
import sys
import json

import random

sys.stdout.reconfigure(encoding='utf-8')

def test_engine():
    # Randomly select between the two valid test IDs
    pool = [
        '000058a12d5b43e67d225668fa1f8d618c13dc232df0cad8ffe7ad4a1091e318',
        '00007e8d4e54114b5b2a9b51586325a8d0fa74ea23ef77334eaec4ffccd7ebcc'
    ]
    customer_id = random.choice(pool)
    
    print(f"🚀 Initializing Strategy Engine for Customer: {customer_id[:12]}...")
    
    # FIRST RUN (Cold Start)
    cold_start = time.time()
    try:
        first_result = conductor.get_customer_360(customer_id)
        if "error" in first_result:
            print("❌ Cold Start failed:", first_result["error"])
            return
    except Exception as e:
        print("❌ CRASH in get_customer_360:", e)
        import traceback
        traceback.print_exc()
        return
        
    print(f"❄️ Cold Start overhead completed in {time.time() - cold_start:.2f}s")
    
    # SECOND RUN (Warm Start)
    print("🔥 Executing Warm Start...")
    warm_start = time.time()
    result = conductor.get_customer_360(customer_id)
    warm_end = time.time()
    
    latency = warm_end - warm_start
    
    print("\n" + "="*50)
    print("🎯 DREAM VIEW OUTPUT")
    print("="*50)
    print(json.dumps(result, indent=2, default=str))
    print("="*50)
    print(f"⏱️ Warm Start Latency: {latency:.4f}s")
    if latency < 2.0:
        print("✅ LATENCY CONSTRAINT MET (< 2.0s)")
    else:
        print("❌ LATENCY CONSTRAINT FAILED (>= 2.0s)")

if __name__ == "__main__":
    test_engine()
