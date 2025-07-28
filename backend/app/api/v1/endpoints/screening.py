from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Optional, Dict, Any
import asyncio
import uuid
import time
from datetime import datetime
import random

router = APIRouter()

# In-memory job storage for demo
jobs_storage: Dict[str, Dict[str, Any]] = {}

@router.post("/run")
async def run_screening(
    request: dict,
    background_tasks: BackgroundTasks
):
    """Start a new stock screening job"""
    try:
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Initialize job
        jobs_storage[job_id] = {
            "job_id": job_id,
            "status": "pending",
            "progress": 0,
            "total_stocks": 0,
            "screened_stocks": 0,
            "found_stocks": 0,
            "created_at": datetime.utcnow().isoformat(),
            "results": [],
            "error_message": None
        }
        
        # Start background screening task
        background_tasks.add_task(run_screening_job, job_id, request)
        
        return {
            "job_id": job_id,
            "status": "pending"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start screening: {str(e)}")

@router.get("/status/{job_id}")
async def get_screening_status(job_id: str):
    """Get the status of a screening job"""
    if job_id not in jobs_storage:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return jobs_storage[job_id]

@router.get("/results/{job_id}")
async def get_screening_results(job_id: str):
    """Get the results of a completed screening job"""
    if job_id not in jobs_storage:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs_storage[job_id]
    
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Job not completed yet")
    
    return {
        "job_id": job["job_id"],
        "status": job["status"],
        "results": job["results"],
        "total_found": len(job["results"])
    }

async def run_screening_job(job_id: str, request: dict):
    """Background task to run the screening job"""
    try:
        job = jobs_storage[job_id]
        job["status"] = "running"
        
        # Mock stock screening process
        mock_stocks = [
            "RELIANCE", "TCS", "HDFCBANK", "INFY", "HINDUNILVR",
            "ICICIBANK", "KOTAKBANK", "SBIN", "BHARTIARTL", "ITC",
            "ASIANPAINT", "LT", "AXISBANK", "MARUTI", "SUNPHARMA"
        ]
        
        job["total_stocks"] = len(mock_stocks)
        results = []
        
        # Simulate screening process
        for i, stock in enumerate(mock_stocks):
            # Update progress
            job["progress"] = int((i / len(mock_stocks)) * 100)
            job["screened_stocks"] = i + 1
            
            # Simulate processing time
            await asyncio.sleep(0.5)
            
            # Mock analysis - randomly include some stocks
            if random.random() > 0.6:  # 40% chance of including stock
                result = {
                    "stock": stock,
                    "consolidating": f"Range = {random.uniform(5, 15):.1f}%",
                    "breaking_out": f"BO: {random.uniform(100, 500):.2f}",
                    "ltp": f"{random.uniform(100, 2000):.2f} ({random.uniform(-5, 5):.1f}%)",
                    "volume": f"{random.uniform(1, 5):.1f}x",
                    "ma_signal": random.choice(["Bullish", "Bearish", "Neutral"]),
                    "rsi": random.randint(30, 70),
                    "trend": random.choice(["Strong Up", "Weak Up", "Sideways", "Weak Down"]),
                    "pattern": random.choice(["", "Hammer", "Doji", "Engulfing"])
                }
                results.append(result)
        
        # Complete the job
        job["status"] = "completed"
        job["progress"] = 100
        job["results"] = results
        job["found_stocks"] = len(results)
        job["completed_at"] = datetime.utcnow().isoformat()
        
    except Exception as e:
        job["status"] = "failed"
        job["error_message"] = str(e)
        job["completed_at"] = datetime.utcnow().isoformat()