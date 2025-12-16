from app.services.llm_connector import llm_connector
import sys

# Mock settings if needed, but llm_connector imports it.
# We need to make sure we are in the right directory for imports to work or set PYTHONPATH.
# Since we are running from backend dir, app module should be found if we run as module or set path.

try:
    print("Testing LLM generation...")
    response = llm_connector.generate_response(
        system_prompt="You are a helpful assistant.",
        user_query="Say 'Hello, World!' if you can hear me."
    )
    print(f"Response: {response}")
    if "Hello, World!" in response:
        print("SUCCESS: AI is responding.")
    else:
        print("WARNING: AI responded but maybe not as expected.")
except Exception as e:
    print(f"ERROR: {e}")
