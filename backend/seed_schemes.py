from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.scheme import Scheme

# Initial Schemes Data
SCHEMES_DATA = [
    {
        "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        "description": "Income support of Rs. 6000/- per year to all landholding farmer families.",
        "category": "Agriculture",
        "ministry": "Ministry of Agriculture and Farmers Welfare",
        "tags": "farmer,income,support,agriculture",
        "eligibility_criteria": {"occupation": "Farmer", "landholding": "Yes"},
        "documents_required": ["Aadhar Card", "Land Papers", "Bank Account"],
        "benefits": {"financial": "Rs. 6000 per year"},
        "active": True
    },
    {
        "name": "Pradhan Mantri Awas Yojana (PMAY)",
        "description": "Affordable housing for all by 2022.",
        "category": "Housing",
        "ministry": "Ministry of Housing and Urban Affairs",
        "tags": "housing,home,loan,urban,rural",
        "eligibility_criteria": {"income_group": "EWS/LIG/MIG"},
        "documents_required": ["Aadhar Card", "Income Certificate"],
        "benefits": {"subsidy": "Interest subsidy on home loan"},
        "active": True
    },
    {
        "name": "Ayushman Bharat",
        "description": "Health insurance coverage of up to Rs. 5 lakh per family per year.",
        "category": "Health",
        "ministry": "Ministry of Health and Family Welfare",
        "tags": "health,insurance,medical,hospital",
        "eligibility_criteria": {"income_group": "BPL"},
        "documents_required": ["Aadhar Card", "Ration Card"],
        "benefits": {"coverage": "Rs. 5 Lakh per family"},
        "active": True
    },
    {
        "name": "Swachh Bharat Mission",
        "description": "To accelerate the efforts to achieve universal sanitation coverage.",
        "category": "Sanitation",
        "ministry": "Ministry of Jal Shakti",
        "tags": "sanitation,toilet,cleanliness",
        "eligibility_criteria": {"residence": "Rural/Urban"},
        "documents_required": ["Aadhar Card"],
        "benefits": {"financial": "Incentive for toilet construction"},
        "active": True
    },
    {
        "name": "Digital India",
        "description": "To ensure the Government's services are made available to citizens electronically.",
        "category": "Technology",
        "ministry": "Ministry of Electronics and Information Technology",
        "tags": "digital,internet,services",
        "eligibility_criteria": {"citizenship": "Indian"},
        "documents_required": ["None"],
        "benefits": {"access": "Digital services"},
        "active": True
    },
    {
        "name": "Make in India",
        "description": "To encourage companies to manufacture their products in India.",
        "category": "Economy",
        "ministry": "Ministry of Commerce and Industry",
        "tags": "business,manufacturing,economy",
        "eligibility_criteria": {"type": "Business"},
        "documents_required": ["Business Registration"],
        "benefits": {"support": "Ease of doing business"},
        "active": True
    }
]

def seed_schemes():
    db = SessionLocal()
    try:
        # Check if schemes already exist to avoid duplicates
        if db.query(Scheme).first():
            print("Schemes already exist. Skipping seed.")
            return

        print("Seeding schemes...")
        for data in SCHEMES_DATA:
            scheme = Scheme(**data)
            db.add(scheme)
        
        db.commit()
        print("Seeding complete. Added 6 schemes.")
    except Exception as e:
        print(f"Error seeding schemes: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_schemes()
