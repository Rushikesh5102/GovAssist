from sqlalchemy.orm import Session
from app.models.scheme import Scheme
from app.models.user import User
import json

class EligibilityService:
    @staticmethod
    def check_eligibility(user_profile: dict, db: Session):
        """
        Matches user profile against all active schemes.
        Returns a list of schemes with match status.
        """
        schemes = db.query(Scheme).filter(Scheme.active == True).all()
        results = []

        for scheme in schemes:
            criteria = scheme.eligibility_criteria
            if not criteria:
                # No criteria = everyone eligible? For MVP yes, or skip.
                results.append(EligibilityService._format_result(scheme, "Eligible", 100))
                continue

            match_score = 0
            total_criteria = len(criteria)
            matches = 0
            missing_criteria = []

            for key, required_value in criteria.items():
                user_value = user_profile.get(key)
                
                # Handle derived fields if the direct key is missing
                if user_value is None:
                    if key == "income_group" and "annual_income" in user_profile:
                        user_value = EligibilityService._map_income_to_group(user_profile["annual_income"])
                    
                if user_value is None:
                    missing_criteria.append(key)
                    continue

                if EligibilityService._is_match(key, user_value, required_value):
                    matches += 1
                else:
                    missing_criteria.append(key)

            score = (matches / total_criteria) * 100 if total_criteria > 0 else 100
            status = "Eligible" if score == 100 else ("Partially Eligible" if score > 0 else "Ineligible")
            
            results.append(EligibilityService._format_result(scheme, status, score, missing_criteria))

        # Sort by score desc
        return sorted(results, key=lambda x: x["match_score"], reverse=True)

    @staticmethod
    def _is_match(key, user_val, req_val):
        """
        Handle different types of criteria matching.
        """
        # String match (case insensitive)
        if isinstance(req_val, str) and isinstance(user_val, str):
            # Check for multi-value requirements like "EWS/LIG/MIG"
            if "/" in req_val:
                options = [o.strip().lower() for o in req_val.split("/")]
                return user_val.lower() in options
            return user_val.lower() == req_val.lower()
        
        # Boolean match
        if isinstance(req_val, bool):
            return bool(user_val) == req_val

        # Numeric match (e.g., income < threshold)
        if key == "annual_income" or "income" in key:
            try:
                u_inc = float(user_val)
                # If req_val is a group (EWS/LIG/MIG), map user income
                if isinstance(req_val, str) and "/" in req_val:
                    u_group = EligibilityService._map_income_to_group(u_inc)
                    options = [o.strip().lower() for o in req_val.split("/")]
                    return u_group.lower() in options
                
                r_inc = float(req_val)
                return u_inc <= r_inc
            except (ValueError, TypeError):
                return False

    @staticmethod
    def _map_income_to_group(income: float) -> str:
        """
        Maps annual income to Indian income groups (simplified).
        """
        if income <= 300000: return "EWS"
        if income <= 600000: return "LIG"
        if income <= 1200000: return "MIG I"
        if income <= 1800000: return "MIG II"
        return "HIG"

    @staticmethod
    def _is_match(key, user_val, req_val):
        """
        Handle different types of criteria matching.
        """
        # Income specific logic
        if key == "income_group" and isinstance(user_val, (int, float)):
             user_val = EligibilityService._map_income_to_group(float(user_val))

        # String match (case insensitive)
        if isinstance(req_val, str) and isinstance(user_val, str):
            # Check for multi-value requirements like "EWS/LIG/MIG"
            user_str = user_val.lower().strip()
            req_str = req_val.lower().strip()
            
            if "/" in req_str:
                options = [o.strip() for o in req_str.split("/")]
                # Lenient match: check if any option matches partially
                return any(opt in user_str or user_str in opt for opt in options)
                
            # Direct lenient match (bidirectional substring)
            return req_str in user_str or user_str in req_str
        
        # Boolean match
        if isinstance(req_val, bool):
            return bool(user_val) == req_val

        # Default fall back to direct equality
        return user_val == req_val

    @staticmethod
    def _format_result(scheme, status, score, missing=[]):
        return {
            "scheme_id": scheme.id,
            "scheme_name": scheme.name,
            "category": scheme.category,
            "status": status,
            "match_score": round(score, 1),
            "missing_criteria": missing,
            "benefits": scheme.benefits,
            "documents_required": scheme.documents_required
        }
