import json
import os

class EligibilityEngine:
    def __init__(self, schemes_path="data/schemes.json"):
        self.schemes_path = schemes_path
        self.schemes = self._load_schemes()

    def _load_schemes(self):
        paths_to_check = [self.schemes_path, os.path.join("..", self.schemes_path), os.path.join("data", "schemes.json")]
        for path in paths_to_check:
            if os.path.exists(path):
                self.schemes_path = path
                break
        
        if not os.path.exists(self.schemes_path):
            print(f"Warning: Schemes file not found at {self.schemes_path}")
            return []
        try:
            with open(self.schemes_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading schemes: {e}")
            return []

    def check_eligibility(self, user_profile: dict):
        eligible_schemes = []
        for scheme in self.schemes:
            rules = scheme.get("rules", {})
            if self._evaluate_rules(rules, user_profile):
                eligible_schemes.append(scheme)
        return eligible_schemes

    def _evaluate_rules(self, rules: dict, profile: dict):
        for key, condition in rules.items():
            user_value = profile.get(key)
            
            if user_value is None:
                return False # Missing data, assume not eligible or need more info

            if isinstance(condition, dict):
                if "max" in condition and user_value > condition["max"]:
                    return False
                if "min" in condition and user_value < condition["min"]:
                    return False
            elif condition != user_value:
                return False
                
        return True

eligibility_engine = EligibilityEngine()
