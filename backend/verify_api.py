import requests
import sys

try:
    response = requests.get("http://localhost:8001/api/schemes")
    if response.status_code == 200:
        data = response.json()
        print(f"Success: Retrieved {len(data)} schemes.")
        sys.exit(0)
    else:
        print(f"Failed: Status Code {response.status_code}")
        print(response.text)
        sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
