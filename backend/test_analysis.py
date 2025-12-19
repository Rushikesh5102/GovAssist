from app.services.document_analyzer import DocumentAnalyzer
from app.services.eligibility_service import EligibilityService
from app.core.database import SessionLocal
import json

def test_full_flow():
    # 1. Mock Extracted Text from an Income Certificate
    mock_text = """
    GOVERNMENT OF MAHARASHTRA
    INCOME CERTIFICATE
    Name: Rajesh Kumar
    Age: 45
    Occupation: Farmer
    Annual Income: 45000
    District: Pune
    State: Maharashtra
    Category: General
    """

    print("--- 1. Testing AI Extraction ---")
    extracted_data = DocumentAnalyzer.analyze_text(mock_text)
    print("Extraction complete.")

    print("\n--- 2. Testing Eligibility Matching ---")
    db = SessionLocal()
    results = []
    try:
        results = EligibilityService.check_eligibility(extracted_data, db)
        print(f"Found {len(results)} schemes.")
    finally:
        db.close()

    print("Saving results to test_output.json")
    with open("test_output.json", "w") as f:
        json.dump({
            "extracted_data": extracted_data,
            "eligibility_results": results
        }, f, indent=2)

if __name__ == "__main__":
    test_full_flow()
