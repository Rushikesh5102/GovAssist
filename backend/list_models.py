import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app.core.config import settings
import google.generativeai as genai

api_key = settings.GOOGLE_API_KEY
if not api_key:
    print("No GOOGLE_API_KEY found in settings")
    sys.exit(1)

print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")

genai.configure(api_key=api_key)

print("Listing models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
