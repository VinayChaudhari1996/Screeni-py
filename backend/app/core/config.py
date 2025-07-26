from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Screenipy API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Database
    DATABASE_URL: str = "sqlite:///./screenipy.db"
    
    # Redis (for caching and job queue)
    REDIS_URL: str = "redis://localhost:6379"
    
    # External APIs
    YAHOO_FINANCE_TIMEOUT: int = 10
    NSE_TIMEOUT: int = 10
    
    # ML Models
    MODEL_PATH: str = "./models"
    CHROMADB_PATH: str = "./chromadb_store"
    
    # File storage
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Screening settings
    MAX_CONCURRENT_SCREENS: int = 5
    DEFAULT_CACHE_TTL: int = 3600  # 1 hour
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()