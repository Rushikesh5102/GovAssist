import sys
import os
import requests
from app.core.config import settings
from app.services.llm_connector import llm_connector
from app.core.database import SessionLocal
from sqlalchemy import text

def check_env():
    print("--- 1. Environment Check ---")
    google_key = os.environ.get("GOOGLE_API_KEY") or settings.GOOGLE_API_KEY
    openai_key = os.environ.get("OPENAI_API_KEY") or settings.OPENAI_API_KEY
    
    print(f"LLM_PROVIDER: {settings.LLM_PROVIDER}")
    print(f"GOOGLE_API_KEY Present: {bool(google_key)}")
    print(f"OPENAI_API_KEY Present: {bool(openai_key)}")
    
    if not google_key and not openai_key:
        print("!! CRITICAL: No API Keys found !!")
    else:
        print("OK: At least one API key found.")

def check_db():
    print("\n--- 2. Database Check ---")
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        print("OK: Database connection successful.")
        db.close()
    except Exception as e:
        print(f"!! FAIL: Database error: {e}")

def check_ai():
    print("\n--- 3. AI Connectivity Check ---")
    try:
        print("Attempting to generate response...")
        # Force re-init to pick up any changes
        msg = llm_connector.generate_response("Test prompt", "Say hello")
        print(f"Result: {msg}")
        
        if "offline" in msg.lower() or "error" in msg.lower() or "unable" in msg.lower():
             print("!! FAIL: AI reported offline or error.")
        else:
             print("OK: AI responded.")
    except Exception as e:
        print(f"!! FAIL: AI Exception: {e}")

def check_login_endpoint():
    print("\n--- 4. Login Endpoint Check ---")
    url = "http://localhost:8001/api/auth/login?remember_me=false"
    # payload = {
    #     "username": "admin@govassist.com",
    #     "password": "admin"
    # }
    # Use multipart/form-data
    files = {
        'username': (None, 'admin@govassist.com'),
        'password': (None, 'admin')
    }
    try:
        r = requests.post(url, files=files)
        print(f"Status Code: {r.status_code}")
        if r.status_code == 200:
            print("OK: Login successful.")
        else:
            print(f"!! FAIL: Login failed. Response: {r.text}")
    except Exception as e:
        print(f"!! FAIL: Request exception: {e}")

if __name__ == "__main__":
    check_env()
    check_db()
    check_ai()
    check_login_endpoint()
