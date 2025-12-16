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
                print("Warning: GOOGLE_API_KEY not found in settings.")
                return None
            return ChatGoogleGenerativeAI(model="gemini-flash-latest", google_api_key=api_key, temperature=0.3)
        
        elif self.provider == "openai":
            api_key = settings.OPENAI_API_KEY
            if not api_key:
                print("Warning: OPENAI_API_KEY not found in settings.")
                return None
            return ChatOpenAI(model="gpt-3.5-turbo", openai_api_key=api_key, temperature=0.3)
        
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    def generate_response(self, system_prompt, user_query):
        if not self.llm:
            return "I am unable to generate a response because the LLM is not initialized. Please check if the GOOGLE_API_KEY or OPENAI_API_KEY is set in the backend/.env file."
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_query)
        ]
        
        try:
            response = self.llm.invoke(messages)
            return response.content
        except Exception as e:
            return f"Error generating response: {e}"

llm_connector = LLMConnector()
