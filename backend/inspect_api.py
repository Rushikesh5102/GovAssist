import requests
import json
import sys

try:
    print("Fetching http://localhost:8001/api/schemes")
    response = requests.get("http://localhost:8001/api/schemes")
    print(f"Status: {response.status_code}")
    print(f"Headers: {response.headers}")
    
    try:
        data = response.json()
        print(f"Type: {type(data)}")
        print(f"Raw Data: {json.dumps(data, indent=2)}")
        
        if isinstance(data, list):
            print("Is List: YES")
        else:
            print("Is List: NO")
            
    except Exception as e:
        print(f"Failed to parse JSON: {e}")
        print(f"Text content: {response.text}")

except Exception as e:
    print(f"Request Failed: {e}")
