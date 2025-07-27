from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Optional, Dict, Any
import asyncio
import uuid
import time
from datetime import datetime

from app.schemas.screening import (
    ScreeningRequest, ScreeningResponse, ScreeningJobStatus, 
    StockResult, ScreeningConfig
)
from app.services.stock_fetcher import StockFetcher
from app.services.stock_analyzer import StockAnalyzer

router = APIRouter()

# In-memory job storage for demo (use database in production)
jobs_storage: Dict[str, Dict[str, Any]] = {}

@router.post("/run", response_model=ScreeningResponse)
async def run_screening(
    request: ScreeningRequest,
    background_tasks: BackgroundTasks,
    config: Optional[ScreeningConfig] = None
):
    """Start a new stock screening job"""
    try:
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Initialize job
        jobs_storage[job_id] = {
            "job_id": job_id,
            "status": ScreeningJobStatus.PENDING,
            "progress": 0,
            "total_stocks": 0,
            "screened_stocks": 0,
            "found_stocks": 0,
            "created_at": datetime.utcnow(),
            "results": [],
            "error_message": None
        }
        
        # Start background screening task
        background_tasks.add_task(run_screening_job, job_id, request, config)
        
        return ScreeningResponse(
            job_id=job_id,
            status=ScreeningJobStatus.PENDING
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start screening: {str(e)}")

@router.get("/status/{job_id}")
async def get_screening_status(job_id: str):
    """Get the status of a screening job"""
    if job_id not in jobs_storage:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs_storage[job_id]
    return {
        "job_id": job["job_id"],
        "status": job["status"],
        "progress": job["progress"],
        "total_stocks": job["total_stocks"],
        "screened_stocks": job["screened_stocks"],
        "found_stocks": job["found_stocks"],
        "created_at": job["created_at"],
        "error_message": job["error_message"]
    }

@router.get("/results/{job_id}", response_model=ScreeningResponse)
async def get_screening_results(job_id: str):
    """Get the results of a completed screening job"""
    if job_id not in jobs_storage:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs_storage[job_id]
    
    if job["status"] != ScreeningJobStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Job not completed yet")
    
    return ScreeningResponse(
        job_id=job["job_id"],
        status=job["status"],
        results=job["results"],
        total_found=len(job["results"]),
        execution_time=job.get("execution_time")
    )

async def run_screening_job(job_id: str, request: ScreeningRequest, config: Optional[ScreeningConfig]):
    """Background task to run the screening job"""
    try:
        job = jobs_storage[job_id]
        job["status"] = ScreeningJobStatus.RUNNING
        
        # Initialize services
        fetcher = StockFetcher()
        analyzer = StockAnalyzer()
        
        # Get stock list based on index type
        if request.stock_codes:
            stock_codes = request.stock_codes
        elif request.index_type == "1":
            stock_codes = await fetcher.get_nifty_50()
        else:
            stock_codes = await fetcher.get_all_stocks()
        
        job["total_stocks"] = len(stock_codes)
        results = []
        
        # Screen each stock
        for i, stock_code in enumerate(stock_codes):
            try:
                # Update progress
                job["progress"] = int((i / len(stock_codes)) * 100)
                job["screened_stocks"] = i + 1
                
                # Fetch and analyze stock data
                stock_data = await fetcher.get_stock_data(stock_code)
                if stock_data is None or stock_data.empty:
                    continue
                
                # Analyze stock
                result = await analyzer.analyze_stock(stock_code, stock_data, request, config)
                if result:
                    results.append(result.dict())
                
                # Small delay to prevent overwhelming APIs
                await asyncio.sleep(0.1)
                
            except Exception as e:
                print(f"Error screening {stock_code}: {e}")
                continue
        
        # Update job with results
        job["status"] = ScreeningJobStatus.COMPLETED
        job["progress"] = 100
        job["results"] = results
        job["found_stocks"] = len(results)
        job["completed_at"] = datetime.utcnow()
        
    except Exception as e:
        job["status"] = ScreeningJobStatus.FAILED
        job["error_message"] = str(e)
        job["completed_at"] = datetime.utcnow()