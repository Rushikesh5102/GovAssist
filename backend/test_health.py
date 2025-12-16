import requests

url = "http://127.0.0.1:8001/api/health"

try:
    print(f"Sending request to {url}...")
    response = requests.get(url, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
