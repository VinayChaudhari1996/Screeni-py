from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from fastapi.responses import StreamingResponse
from typing import List, Optional
import asyncio
import uuid
import json
from datetime import datetime
import io
import csv

from app.schemas.screening import (
    ScreeningRequest, ScreeningResponse, ScreeningJob, 
    ScreeningJobStatus, ScreeningConfig
)
from app.services.screener import ScreenerService
from app.services.job_manager import JobManager
from app.core.database import get_db
from app.models.screening import ScreeningJobModel

router = APIRouter()

@router.post("/run", response_model=ScreeningResponse)
async def run_screening(
    request: ScreeningRequest,
    background_tasks: BackgroundTasks,
    config: Optional[ScreeningConfig] = None,
    db = Depends(get_db)
):
    """
    Start a new stock screening job
    """
    try:
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Create job record
        job = ScreeningJobModel(
            job_id=job_id,
            status=ScreeningJobStatus.PENDING,
            request_data=request.dict(),
            config_data=config.dict() if config else None,
            created_at=datetime.utcnow()
        )
        
        # Save to database
        db.add(job)
        db.commit()
        
        # Start background screening task
        screener_service = ScreenerService()
        background_tasks.add_task(
            screener_service.run_screening_job,
            job_id=job_id,
            request=request,
            config=config
        )
        
        return ScreeningResponse(
            job_id=job_id,
            status=ScreeningJobStatus.PENDING
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start screening: {str(e)}")

@router.get("/status/{job_id}", response_model=ScreeningJob)
async def get_screening_status(
    job_id: str,
    db = Depends(get_db)
):
    """
    Get the status of a screening job
    """
    job = db.query(ScreeningJobModel).filter(ScreeningJobModel.job_id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return ScreeningJob(
        job_id=job.job_id,
        status=job.status,
        progress=job.progress or 0,
        total_stocks=job.total_stocks,
        screened_stocks=job.screened_stocks,
        found_stocks=job.found_stocks,
        created_at=job.created_at,
        completed_at=job.completed_at,
        error_message=job.error_message
    )

@router.get("/results/{job_id}", response_model=ScreeningResponse)
async def get_screening_results(
    job_id: str,
    db = Depends(get_db)
):
    """
    Get the results of a completed screening job
    """
    job = db.query(ScreeningJobModel).filter(ScreeningJobModel.job_id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != ScreeningJobStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Job not completed yet")
    
    return ScreeningResponse(
        job_id=job.job_id,
        status=job.status,
        results=job.results,
        total_found=len(job.results) if job.results else 0,
        execution_time=job.execution_time,
        config_used=ScreeningConfig(**job.config_data) if job.config_data else None
    )

@router.delete("/cancel/{job_id}")
async def cancel_screening(
    job_id: str,
    db = Depends(get_db)
):
    """
    Cancel a running screening job
    """
    job = db.query(ScreeningJobModel).filter(ScreeningJobModel.job_id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status not in [ScreeningJobStatus.PENDING, ScreeningJobStatus.RUNNING]:
        raise HTTPException(status_code=400, detail="Job cannot be cancelled")
    
    # Update job status
    job.status = ScreeningJobStatus.CANCELLED
    job.completed_at = datetime.utcnow()
    db.commit()
    
    # Signal job manager to cancel the job
    job_manager = JobManager()
    await job_manager.cancel_job(job_id)
    
    return {"message": "Job cancelled successfully"}

@router.get("/export/{job_id}")
async def export_results(
    job_id: str,
    format: str = Query("csv", regex="^(csv|json)$"),
    db = Depends(get_db)
):
    """
    Export screening results in CSV or JSON format
    """
    job = db.query(ScreeningJobModel).filter(ScreeningJobModel.job_id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job.status != ScreeningJobStatus.COMPLETED or not job.results:
        raise HTTPException(status_code=400, detail="No results available")
    
    if format == "csv":
        # Create CSV content
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=job.results[0].keys())
        writer.writeheader()
        writer.writerows([result.dict() for result in job.results])
        
        content = output.getvalue()
        output.close()
        
        return StreamingResponse(
            io.BytesIO(content.encode()),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=screening_results_{job_id}.csv"}
        )
    
    else:  # JSON format
        content = json.dumps([result.dict() for result in job.results], indent=2)
        
        return StreamingResponse(
            io.BytesIO(content.encode()),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=screening_results_{job_id}.json"}
        )

@router.get("/history")
async def get_screening_history(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db = Depends(get_db)
):
    """
    Get screening job history
    """
    jobs = db.query(ScreeningJobModel)\
        .order_by(ScreeningJobModel.created_at.desc())\
        .offset(offset)\
        .limit(limit)\
        .all()
    
    return [
        ScreeningJob(
            job_id=job.job_id,
            status=job.status,
            progress=job.progress or 0,
            total_stocks=job.total_stocks,
            screened_stocks=job.screened_stocks,
            found_stocks=job.found_stocks,
            created_at=job.created_at,
            completed_at=job.completed_at,
            error_message=job.error_message
        )
        for job in jobs
    ]

@router.websocket("/ws/{job_id}")
async def websocket_screening_progress(websocket, job_id: str):
    """
    WebSocket endpoint for real-time screening progress updates
    """
    await websocket.accept()
    
    try:
        job_manager = JobManager()
        async for progress_update in job_manager.get_job_progress(job_id):
            await websocket.send_json(progress_update)
            
            # Break if job is completed or failed
            if progress_update.get("status") in ["completed", "failed", "cancelled"]:
                break
                
    except Exception as e:
        await websocket.send_json({"error": str(e)})
    finally:
        await websocket.close()