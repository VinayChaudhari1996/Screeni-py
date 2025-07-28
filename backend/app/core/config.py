from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Screenipy API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "screenipy-secret-key-change-in-production"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
    
    # External APIs
    YAHOO_FINANCE_TIMEOUT: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()