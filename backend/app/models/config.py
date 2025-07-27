from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class UserConfig(Base):
    __tablename__ = "user_configs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)  # Default user for now
    
    # Screening configuration
    period = Column(String(10), default="300d")
    days_to_lookback = Column(Integer, default=30)
    duration = Column(String(10), default="1d")
    min_price = Column(Float, default=30.0)
    max_price = Column(Float, default=10000.0)
    volume_ratio = Column(Float, default=2.0)
    consolidation_percentage = Column(Integer, default=10)
    
    # Flags
    shuffle = Column(Boolean, default=True)
    cache_enabled = Column(Boolean, default=True)
    stage_two_only = Column(Boolean, default=True)
    use_ema = Column(Boolean, default=False)
    
    # Additional settings as JSON
    additional_settings = Column(JSON)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<UserConfig(user_id={self.user_id}, period={self.period})>"