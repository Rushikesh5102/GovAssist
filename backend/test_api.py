import requests
import json
import sys

url = "http://127.0.0.1:8001/api/chat"
payload = {"message": "Hello", "session_id": None}
headers = {"Content-Type": "application/json"}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload, headers=headers, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 200:
        print("SUCCESS: API is working.")
    else:
        print("FAILURE: API returned error.")
except Exception as e:
    print(f"ERROR: {e}")
