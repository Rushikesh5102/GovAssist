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

    class Config:
        env_file = ".env"

settings = Settings()
