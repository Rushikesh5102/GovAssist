from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GovAssist"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "CHANGE_ME_IN_PROD"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = "sqlite:///./sql_app.db" # Default to sqlite for dev

    # LLM
    LLM_PROVIDER: str = "gemini"
    GOOGLE_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None

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
