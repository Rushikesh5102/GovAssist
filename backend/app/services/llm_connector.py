import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

from app.core.config import settings

class LLMConnector:
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.llm = self._initialize_llm()

    def _initialize_llm(self):
        if self.provider == "gemini":
            api_key = settings.GOOGLE_API_KEY
            if not api_key:
                print("WARNING: GOOGLE_API_KEY missing. Activating MOCK MODE.")
                self.mock_mode = True
                return None
            return ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key, temperature=0.3, timeout=60)
        
        elif self.provider == "openai":
            api_key = settings.OPENAI_API_KEY
            if not api_key:
                print("WARNING: OPENAI_API_KEY missing. Activating MOCK MODE.")
                self.mock_mode = True
                return None
            return ChatOpenAI(model="gpt-3.5-turbo", openai_api_key=api_key, temperature=0.3, timeout=60)
        
        else:
            print(f"Warning: Unsupported LLM provider '{self.provider}'. Activating MOCK MODE.")
            self.mock_mode = True
            return None

    def _get_mock_response(self, user_query):
        lower_query = user_query.lower()
        
        # 1. PM Kisan Scheme
        if "kisan" in lower_query or "farmer" in lower_query:
            return (
                "**Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)**\n\n"
                "This is a flagship scheme to provide income support to all landholding farmer families.\n\n"
                "### **Key Benefits:**\n"
                "- **Financial Support**: ₹6,000 per year is transferred directly into the bank accounts of farmers.\n"
                "- **Installments**: The amount is released in three equal installments of ₹2,000 each (every 4 months).\n\n"
                "### **Eligibility Criteria:**\n"
                "- All landholding farmer families having cultivable landholding in their names are eligible.\n"
                "- **Exclusions**: Institutional landholders, farmer families holding constitutional posts, serving or retired officers/employees of State/Central Government, etc.\n\n"
                "### **Step-by-Step Application Process:**\n"
                "1. **Visit Official Portal**: Go to [pmkisan.gov.in](https://pmkisan.gov.in).\n"
                "2. **New Farmer Registration**: Under 'Farmers Corner', click on 'New Farmer Registration'.\n"
                "3. **Enter Details**: Select 'Rural' or 'Urban', enter your Aadhar Number, and Select State.\n"
                "4. **OTP Verification**: Enter the Captcha and click 'Get OTP'. Verify the OTP sent to your mobile.\n"
                "5. **Fill Form**: Enter personal details, land details (Khata/Khasra number), and bank details.\n"
                "6. **Submit**: Save the form. Your application will be pending for approval by the State Nodal Officer.\n\n"
                "*(Mock Mode: Simulation)*"
            )

        # 2. Awas Yojana (Housing)
        elif "awas" in lower_query or "housing" in lower_query or "home" in lower_query:
            return (
                "**Pradhan Mantri Awas Yojana (PMAY)**\n\n"
                "PMAY aims to provide 'Housing for All' by 2024. It has two components: PMAY-Urban (PMAY-U) and PMAY-Gramin (PMAY-G).\n\n"
                "### **Key Benefits:**\n"
                "- **Subsidy**: Interest subsidy up to 6.5% on home loans under the Credit Linked Subsidy Scheme (CLSS).\n"
                "- **Financial Assistance**: Up to ₹1.2 Lakh (for plains) or ₹1.3 Lakh (for hilly areas) for house construction in rural areas.\n\n"
                "### **Eligibility:**\n"
                "- **EWS/LIG**: Annual income up to ₹3 Lakh (EWS) or ₹6 Lakh (LIG).\n"
                "- **MIG**: Annual income between ₹6 Lakh to ₹18 Lakh.\n"
                "- The family should not own a pucca house anywhere in India.\n\n"
                "### **How to Apply (Step-by-Step):**\n"
                "1. **Identify Category**: Determine if you fall under Urban or Gramin based on your location.\n"
                "2. **PMAY Urban**: Visit [pmaymis.gov.in](https://pmaymis.gov.in), select 'Citizen Assessment', and choose 'Apply Online'.\n"
                "3. **Aadhar Validation**: Enter your Aadhar number and name.\n"
                "4. **Fill Application**: Provide personal, income, and bank details. Select the preferred component (e.g., Subsidy or Affordable Housing).\n"
                "5. **PMAY Gramin**: Contact your local Gram Panchayat or Ward Officer to get your name added to the beneficiary list based on SECC 2011 data.\n\n"
                "*(Mock Mode: Simulation)*"
            )
            
        # 3. Ayushman Bharat (Health)
        elif "ayushman" in lower_query or "health" in lower_query:
            return (
                "**Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)**\n\n"
                "This is the world's largest government-funded healthcare program.\n\n"
                "### **Key Benefits:**\n"
                "- **Coverage**: ₹5 Lakh health insurance cover per family per year.\n"
                "- **Hospitals**: Cashless treatment at all empanelled public and private hospitals.\n"
                "- **Treatments**: Covers 1,350+ medical procedures including surgery, day care, and diagnostics.\n\n"
                "### **Eligibility:**\n"
                "- Households listed in the SECC 2011 database as deprived/occupational categories.\n"
                "- No cap on family size or age.\n\n"
                "### **How to Avail:**\n"
                "1. **Check Eligibility**: Visit [pmjay.gov.in](https://pmjay.gov.in) and use 'Am I Eligible'.\n"
                "2. **Golden Card**: If eligible, visit a Common Service Centre (CSC) or empanelled hospital to generate your Ayushman Card.\n"
                "3. **Treatment**: Show the card at the hospital to avail cashless treatment.\n\n"
                "*(Mock Mode: Simulation)*"
            )

        # 4. Aadhar Card Services
        elif "aadhar" in lower_query or "uidai" in lower_query:
            return (
                "**Aadhar Card Services (UIDAI)**\n\n"
                "Aadhar is a 12-digit unique identity number aimed at delivery of subsidies, benefits, and services.\n\n"
                "### **How to Apply for New Aadhar:**\n"
                "1. **Locate Center**: Visit [uidai.gov.in](https://uidai.gov.in) and click 'Locate an Enrolment Center'.\n"
                "2. **Book Appointment**: You can also 'Book an Appointment' online to save time.\n"
                "3. **Visit Center**: Go to the center with Proof of Identity (POI) and Proof of Address (POA) documents (e.g., Voter ID, Passport).\n"
                "4. **Biometrics**: Give your biometrics (fingerprints, iris scan, photo).\n"
                "5. **Acknowledgement**: You will get an Enrolment ID (EID) to track status.\n\n"
                "### **How to Download / Update:**\n"
                "- **Download**: Go to 'My Aadhaar' > 'Download Aadhaar' on the website.\n"
                "- **Update**: You can update Address online. For biometric or other changes, verify at a center.\n\n"
                "*(Mock Mode: Simulation)*"
            )

        # 4. Greetings
        elif "hello" in lower_query or "hi" in lower_query:
            return "Namaste! I am your GovAssist AI. Ask me about schemes like **PM Kisan**, **Awas Yojana**, or **Ayushman Bharat** for detailed information."

        # 5. Default Generic / Eligibility
        elif "scheme" in lower_query or "eligibility" in lower_query:
            return "We have details on many schemes! Could you specify which one you are interested in? For example, ask about 'PM Kisan' or 'Housing Schemes'."
        
        # 6. Fallback
        else:
            return (
                "I can help you with information on Government Schemes and document analysis.\n\n"
                "Try asking:\n"
                "- 'Tell me about PM Kisan'\n"
                "- 'How to apply for Awas Yojana?'\n"
                "- 'What is Ayushman Bharat?'"
            )

    def generate_response(self, system_prompt, user_query):
        if getattr(self, 'mock_mode', False) or not self.llm:
            return self._get_mock_response(user_query)
        
        # Real LLM Call
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_query)
        ]
        
        from tenacity import retry, stop_after_attempt, wait_exponential
        
        @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
        def _invoke_llm():
            return self.llm.invoke(messages)
            
        try:
            response = _invoke_llm()
            content = response.content
            
            # Handle list content
            if isinstance(content, list):
                text_parts = []
                for part in content:
                    if isinstance(part, str):
                        text_parts.append(part)
                    elif isinstance(part, dict) and "text" in part:
                        text_parts.append(part["text"])
                return "".join(text_parts)
                
            return content
        except Exception as e:
            print(f"LLM Invocation Failed after retries: {e}. Falling back to mock response.")
            return self._get_mock_response(user_query)

llm_connector = LLMConnector()
