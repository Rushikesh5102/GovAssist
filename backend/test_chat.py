import requests
import json

try:
    response = requests.post(
        "http://localhost:8001/api/chat/",
        json={"message": "hello"},
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
