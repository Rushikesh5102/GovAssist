from app.core.database import SessionLocal, engine, Base
from app.models.scheme import Scheme
from app.models.user import User
import json

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    try:
        # Check if schemes exist
        count = db.query(Scheme).count()
        print(f"Current Scheme Count: {count}")
        
        schemes_data = [
            {
                "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                "description": "Income support of ₹6,000/- per year in three equal installments to all landholding farmer families.",
                "category": "Agriculture",
                "ministry": "Ministry of Agriculture",
                "active": True,
                "eligibility_criteria": {"role": "Farmer", "land": "Yes"},
                "benefits": {"amount": "6000", "period": "Yearly"}
            },
            {
                "name": "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
                "description": "Financial assistance for construction of pucca house for homeless and those living in dilapidated houses in rural areas.",
                "category": "Housing",
                "ministry": "Ministry of Rural Development",
                "active": True,
                "eligibility_criteria": {"income": "low", "housing": "none"},
                "benefits": {"subsidy": "1.2 Lakh"}
            },
            {
                "name": "Ayushman Bharat - PMJAY",
                "description": "Health coverage of ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.",
                "category": "Health",
                "ministry": "Ministry of Health",
                "active": True,
                "eligibility_criteria": {"category": "SECC 2011"},
                "benefits": {"insurance": "5 Lakh"}
            },
            {
                "name": "Atal Pension Yojana (APY)",
                "description": "Pension scheme for citizens of India focused on unorganized sector workers.",
                "category": "Pension",
                "ministry": "Ministry of Finance",
                "active": True,
                "eligibility_criteria": {"age": "18-40"},
                "benefits": {"pension": "1000-5000"}
            },
             {
                "name": "Skill India",
                "description": "Training over 40 crore people in India in different skills by 2022.",
                "category": "Education",
                "ministry": "Ministry of Skill Development",
                "active": True,
                "eligibility_criteria": {"age": "18+"},
                "benefits": {"training": "free"}
            }
        ]

        for s_data in schemes_data:
            existing = db.query(Scheme).filter(Scheme.name == s_data["name"]).first()
            if not existing:
                scheme = Scheme(
                    name=s_data["name"],
                    description=s_data["description"],
                    category=s_data["category"],
                    ministry=s_data["ministry"],
                    active=s_data["active"],
                    eligibility_criteria=json.dumps(s_data["eligibility_criteria"]),
                    benefits=json.dumps(s_data["benefits"]),
                    tags="Central,Welfare"
                )
                db.add(scheme)
                print(f"Added: {s_data['name']}")
            else:
                print(f"Exists: {s_data['name']}")
        
        db.commit()
        print("Seeding Complete.")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
