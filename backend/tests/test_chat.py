import requests
import sys
import json

print("Testing direct terminal stream for Customer ID...")
url = "http://localhost:8000/api/v1/chat"
payload = {"message": "000058a12d5b43e67d225668fa1f8d618c13dc232df0cad8ffe7ad4a1091e318"}

try:
    response = requests.post(url, json=payload, stream=True)
    for line in response.iter_lines():
        if line:
            decoded = line.decode('utf-8')
            print(decoded)
except Exception as e:
    print(f"Failed to connect: {e}")
