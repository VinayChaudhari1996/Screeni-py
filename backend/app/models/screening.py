from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, Float, Boolean
from sqlalchemy.sql import func
from app.core.database import Base
from app.schemas.screening import ScreeningJobStatus

class ScreeningJobModel(Base):
    __tablename__ = "screening_jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String(36), unique=True, index=True, nullable=False)
    status = Column(String(20), default=ScreeningJobStatus.PENDING, nullable=False)
    progress = Column(Integer, default=0)
    total_stocks = Column(Integer)
    screened_stocks = Column(Integer, default=0)
    found_stocks = Column(Integer, default=0)
    
    # Store request and config as JSON
    request_data = Column(JSON)
    config_data = Column(JSON)
    
    # Store results as JSON
    results = Column(JSON)
    
    # Execution metrics
    execution_time = Column(Float)
    error_message = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    
    def __repr__(self):
        return f"<ScreeningJob(job_id={self.job_id}, status={self.status})>"