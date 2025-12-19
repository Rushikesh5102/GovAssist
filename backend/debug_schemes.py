from app.core.database import SessionLocal, engine
from app.models.scheme import Scheme
from sqlalchemy import text

# Ensure table exists
# Base.metadata.create_all(bind=engine) # checking if this helps, but main.py does it

db = SessionLocal()
try:
    count = db.query(Scheme).count()
    print(f"Total Schemes in DB: {count}")
    
    schemes = db.query(Scheme).all()
    for s in schemes:
        print(f"- {s.id}: {s.name} (Active: {s.active})")
        
    if count == 0:
        print("Database is empty! Attempting to force seed...")
        # Direct Seed
        default_schemes = [
            {
                "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                "description": "Income support of ₹6,000/- per year in three equal installments.",
                "category": "Agriculture",
                "ministry": "Ministry of Agriculture",
                "active": True,
                "eligibility_criteria": {"role": "Farmer"},
                "benefits": {"amount": "6000"}
            },
            {
                "name": "Pradhan Mantri Awas Yojana (PMAY)",
                "description": "Housing for All.",
                "category": "Housing",
                "ministry": "Ministry of Housing",
                "active": True,
                "eligibility_criteria": {"income": "low"},
                "benefits": {"subsidy": "Yes"}
            }
        ]
        import json
        for data in default_schemes:
            new_s = Scheme(
                name=data["name"],
                description=data["description"],
                category=data["category"],
                ministry=data["ministry"],
                active=data["active"],
                eligibility_criteria=json.dumps(data["eligibility_criteria"]),
                benefits=json.dumps(data["benefits"])
            )
            db.add(new_s)
        db.commit()
        print("Forced seed complete.")
        
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
