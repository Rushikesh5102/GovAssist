from app.services.llm_connector import llm_connector
import json
import re

class DocumentAnalyzer:
    @staticmethod
    def analyze_text(text: str) -> dict:
        """
        Sends extracted document text to LLM to extract structured attributes.
        """
        prompt = f"""Extract the following user attributes from the provided document text. 
If a value is not found, use null. Return ONLY a valid JSON object.

Attributes:
- full_name
- age
- occupation (e.g., Farmer, Student, Business, Unemployed)
- annual_income (number)
- location (JSON: {{"state": "...", "district": "..."}})
- category (e.g., SC, ST, OBC, General)
- gender
- landholding (boolean or acres if mentioned)

Document Text:
{text}

JSON Output:"""

        response = llm_connector.generate_response(prompt, "Extract profile data")
        
        # Clean up common markdown formatting if present
        cleaned_response = response.strip()
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[len("```json"):].strip()
        if cleaned_response.endswith("```"):
            cleaned_response = cleaned_response[:-3].strip()

        try:
            # SAVE RAW FOR DEBUGGING
            with open("llm_raw.txt", "w") as f:
                f.write(response)

            # Attempt to find JSON in response if LLM added preamble
            json_match = re.search(r'\{.*\}', cleaned_response, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return json.loads(cleaned_response)
        except Exception as e:
            print(f"Error parsing LLM response for document analysis: {e}. Raw: {response}")
            return {}

    @staticmethod
    def merge_profiles(existing_profile: dict, new_data: dict) -> dict:
        """
        Merges new extracted data into existing profile, prioritizing non-null values.
        """
        merged = existing_profile.copy()
        for key, value in new_data.items():
            if value is not None and value != "null":
                merged[key] = value
        return merged
