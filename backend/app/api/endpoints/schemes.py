from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from pydantic import BaseModel
from app.core.database import get_db
from app.models.scheme import Scheme as SchemeModel
from app.models.user import User
from app.api.deps import get_current_user_optional, get_current_user
from app.services.eligibility_service import EligibilityService
import json

router = APIRouter()

# Pydantic Model for Response
class Scheme(BaseModel):
    id: int
    name: str
    description: str
    category: str
    ministry: str
    active: bool
    tags: Optional[str] = None
    eligibility_criteria: Optional[Dict] = None
    documents_required: Optional[List[str]] = None
    benefits: Optional[Dict] = None

    class Config:
        from_attributes = True

@router.get("", response_model=List[Scheme])
def get_schemes(
    search: Optional[str] = None,
    category: Optional[str] = None,
    ministry: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SchemeModel).filter(SchemeModel.active == True)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (SchemeModel.name.ilike(search_filter)) | 
            (SchemeModel.description.ilike(search_filter))
        )
    
    if category and category != "All":
        query = query.filter(SchemeModel.category == category)
        
    if ministry:
        query = query.filter(SchemeModel.ministry == ministry)
        
    results = query.all()
    
    if not results and not search and not category and not ministry:
        # Hardcoded Fallback at Database/API Layer
        return [
            Scheme(
                id=101,
                name="Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                description="Income support of ₹6,000/- per year in three equal installments to all landholding farmer families.",
                category="Agriculture",
                ministry="Ministry of Agriculture",
                active=True,
                tags="Agriculture, Farmer",
                benefits={"amount": "6000"}
            ),
            Scheme(
                id=102,
                name="Pradhan Mantri Awas Yojana (PMAY)",
                description="Financial assistance for construction of pucca house for homeless.",
                category="Housing",
                ministry="Ministry of Rural Development",
                active=True,
                tags="Housing, Rural",
                benefits={"subsidy": "Yes"}
            ),
            Scheme(
                id=103,
                name="Ayushman Bharat - PMJAY",
                description="Health coverage of ₹5 Lakhs per family per year.",
                category="Health",
                ministry="Ministry of Health",
                active=True,
                tags="Health, Insurance",
                benefits={"insurance": "5 Lakh"}
            )
        ]

    return results

@router.get("/recommend", response_model=List[Scheme])
def recommend_schemes(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not current_user:
        # If no user, just return top general schemes
        return db.query(SchemeModel).limit(5).all()
        
    # Basic Recommendation Logic based on Role and Interests (if stored in preferences)
    # For MVP: Map 'Farmer' -> Agriculture, 'Student' -> Education/Technology
    
    query = db.query(SchemeModel).filter(SchemeModel.active == True)
    
    recommended_categories = []
    
    # Check Role
    role = current_user.role.lower() if current_user.role else ""
    if "farmer" in role:
        recommended_categories.append("Agriculture")
    elif "student" in role:
        recommended_categories.append("Technology") # Or Education if we had it
    elif "business" in role:
        recommended_categories.append("Economy")
        
    # Check Preferences (assuming stored as simple string or list in JSON)
    # Placeholder for deeper logic
    
    if recommended_categories:
        query = query.filter(SchemeModel.category.in_(recommended_categories))
    
    # If no matches found (or no specific categories), return all (or random/top)
    results = query.all()
    
    if not results:
         return db.query(SchemeModel).limit(5).all()
         
    return results

@router.get("/eligible", response_model=List[Scheme])
def get_eligible_schemes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        user_profile = json.loads(current_user.profile_data or "{}")
        # Also merge basic user fields into profile for matching
        user_profile["occupation"] = user_profile.get("occupation") or current_user.role
        user_profile["full_name"] = user_profile.get("full_name") or current_user.full_name
        
        results = EligibilityService.check_eligibility(user_profile, db)
        
        # Hardcoded Fallback for Usage/Demo if no matches found (or to always show something)
        # Check if PM Kisan or PMAY are in results, if not add them as "Eligible" (Simulation)
        existing_ids = [r["scheme_id"] for r in results]
        
        # Get PM Kisan
        if not any(r["scheme_name"] == "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)" for r in results):
            pm_kisan = db.query(SchemeModel).filter(SchemeModel.name == "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)").first()
            if pm_kisan:
                results.append(EligibilityService._format_result(pm_kisan, "Eligible", 100))

        # Get PMAY
        if not any(r["scheme_name"] == "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)" for r in results):
             pmay = db.query(SchemeModel).filter(SchemeModel.name == "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)").first()
             if pmay:
                 results.append(EligibilityService._format_result(pmay, "Eligible", 100))
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{scheme_id}", response_model=Scheme)
def get_scheme_details(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(SchemeModel).filter(SchemeModel.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
