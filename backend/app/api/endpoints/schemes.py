from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

router = APIRouter()

class Scheme(BaseModel):
    id: int
    name: str
    description: str
    category: str
    ministry: str
    active: bool

# Mock Data
MOCK_SCHEMES = [
    {
        "id": 1,
        "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        "description": "Income support of Rs. 6000/- per year to all landholding farmer families.",
        "category": "Agriculture",
        "ministry": "Ministry of Agriculture and Farmers Welfare",
        "active": True
    },
    {
        "id": 2,
        "name": "Pradhan Mantri Awas Yojana (PMAY)",
        "description": "Affordable housing for all by 2022.",
        "category": "Housing",
        "ministry": "Ministry of Housing and Urban Affairs",
        "active": True
    },
    {
        "id": 3,
        "name": "Ayushman Bharat",
        "description": "Health insurance coverage of up to Rs. 5 lakh per family per year.",
        "category": "Health",
        "ministry": "Ministry of Health and Family Welfare",
        "active": True
    },
    {
        "id": 4,
        "name": "Swachh Bharat Mission",
        "description": "To accelerate the efforts to achieve universal sanitation coverage.",
        "category": "Sanitation",
        "ministry": "Ministry of Jal Shakti",
        "active": True
    },
    {
        "id": 5,
        "name": "Digital India",
        "description": "To ensure the Government's services are made available to citizens electronically.",
        "category": "Technology",
        "ministry": "Ministry of Electronics and Information Technology",
        "active": True
    },
    {
        "id": 6,
        "name": "Make in India",
        "description": "To encourage companies to manufacture their products in India.",
        "category": "Economy",
        "ministry": "Ministry of Commerce and Industry",
        "active": True
    }
]

@router.get("/", response_model=List[Scheme])
def get_schemes():
    return MOCK_SCHEMES
