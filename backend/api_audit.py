import requests
import time

BASE_URL = "http://localhost:8001/api"

endpoints_to_test = [
    ("/health", "GET"),
    ("/schemes/", "GET"),
    ("/schemes/categories", "GET"),
    ("/admin/config", "GET"),
]

def run_audit():
    print("Starting Deep API Audit...")
    errors = 0
    for endpoint, method in endpoints_to_test:
        url = f"{BASE_URL}{endpoint}"
        try:
            if method == "GET":
                response = requests.get(url, timeout=5)
            
            if response.status_code >= 400:
                print(f"[FAIL] {method} {endpoint} returned {response.status_code}: {response.text}")
                errors += 1
            else:
                print(f"[PASS] {method} {endpoint} - Status {response.status_code}")
        except Exception as e:
            print(f"[ERROR] Could not reach {method} {endpoint}: {e}")
            errors += 1
            
    if errors == 0:
        print("\n✅ API Audit Complete: No errors found. All endpoints are healthy.")
    else:
        print(f"\n❌ API Audit Complete: Found {errors} errors.")

if __name__ == "__main__":
    time.sleep(1) # wait for server to settle
    run_audit()
