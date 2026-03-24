import sys
from fastapi.testclient import TestClient
from app.main import app

def run():
    print("Initializing FastAPI TestClient (Executing Cold Start)...")
    with TestClient(app) as client:
        print("Ready. Sending Payload for Customer ID: 000058a12d5b43e67d225668fa1f8d618c13dc232df0cad8ffe7ad4a1091e318")
        payload = {"message": "000058a12d5b43e67d225668fa1f8d618c13dc232df0cad8ffe7ad4a1091e318"}
        
        response = client.post("/api/v1/chat", json=payload, stream=True)
        print(f"Status code: {response.status_code}")
        for chunk in response.iter_lines():
            if chunk:
                print(chunk)

if __name__ == "__main__":
    run()
