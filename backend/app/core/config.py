from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "GovAssist"
    API_V1_STR: str = "/api"
    SECRET_KEY: str
    SENTRY_DSN: str | None = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database & Storage
    DATABASE_URL: str = "sqlite:///./sql_app.db" # Default to sqlite for dev
    SUPABASE_URL: str | None = None
    SUPABASE_KEY: str | None = None
    ENABLE_SUPABASE: bool = True

    # Scraper
    ENABLE_SCRAPER: bool = False

    # LLM
    ENABLE_LLM: bool = True
    LLM_PROVIDER: str = "gemini"
    GOOGLE_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None

    @field_validator('GOOGLE_API_KEY', 'OPENAI_API_KEY', mode='before')
    @classmethod
    def strip_spaces(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

    # Email Settings
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None # App Password for Gmail
    EMAIL_FROM: str = "noreply@govassist.com"

    # SMS Settings (Twilio)
    TWILIO_ACCOUNT_SID: str | None = None
    TWILIO_AUTH_TOKEN: str | None = None
    TWILIO_PHONE_NUMBER: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()
