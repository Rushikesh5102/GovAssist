from app.core.database import SessionLocal
from app.services.rag_service import get_rag_response
from app.models.scheme import Scheme
import sys

# Setup DB
db = SessionLocal()

try:
    print("Testing RAG Service with query: 'schemes for farmers'")
    response = get_rag_response("schemes for farmers", db, language="en")
    
    print("\n--- Answer ---")
    print(response["answer"])
    
    print("\n--- Sources ---")
    sources = response["sources"]
    for s in sources:
        print(f"- {s['title']}")
    
    # Assertions
    found_pm_kisan = any("Kisan" in s["title"] for s in sources)
    if found_pm_kisan:
        print("\nSUCCESS: Found PM-KISAN in sources!")
        sys.exit(0)
    else:
        print("\nFAILURE: PM-KISAN not found in sources.")
        sys.exit(1)

except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
finally:
    db.close()
