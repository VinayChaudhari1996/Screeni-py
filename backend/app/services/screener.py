import asyncio
import time
from datetime import datetime
from typing import List, Optional
import pandas as pd
from sqlalchemy.orm import Session

from app.core.database import get_db_sync
from app.models.screening import ScreeningJobModel
from app.schemas.screening import ScreeningRequest, ScreeningConfig, ScreeningJobStatus, StockResult
from app.services.stock_fetcher import StockFetcher
from app.services.stock_analyzer import StockAnalyzer

class ScreenerService:
    def __init__(self):
        self.stock_fetcher = StockFetcher()
        self.stock_analyzer = StockAnalyzer()

    async def run_screening_job(
        self, 
        job_id: str, 
        request: ScreeningRequest, 
        config: Optional[ScreeningConfig] = None
    ):
        """Run the screening job in background"""
        db = get_db_sync()
        start_time = time.time()
        
        try:
            # Update job status to running
            job = db.query(ScreeningJobModel).filter(ScreeningJobModel.job_id == job_id).first()
            if not job:
                return
            
            job.status = ScreeningJobStatus.RUNNING
            job.started_at = datetime.utcnow()
            db.commit()
            
            # Get stock list based on index type
            stock_codes = await self._get_stock_codes(request, db)
            
            # Update total stocks count
            job.total_stocks = len(stock_codes)
            db.commit()
            
            # Screen stocks
            results = await self._screen_stocks(job_id, stock_codes, request, config, db)
            
            # Update job with results
            execution_time = time.time() - start_time
            job.status = ScreeningJobStatus.COMPLETED
            job.completed_at = datetime.utcnow()
            job.execution_time = execution_time
            job.results = [result.dict() for result in results]
            job.found_stocks = len(results)
            db.commit()
            
        except Exception as e:
            # Update job with error
            job.status = ScreeningJobStatus.FAILED
            job.completed_at = datetime.utcnow()
            job.error_message = str(e)
            db.commit()
            
        finally:
            db.close()

    async def _get_stock_codes(self, request: ScreeningRequest, db: Session) -> List[str]:
        """Get list of stock codes based on index type"""
        if request.stock_codes:
            return request.stock_codes
        
        # Map index types to stock lists
        index_mapping = {
            "0": request.stock_codes or [],
            "1": await self.stock_fetcher.get_nifty_50(),
            "2": await self.stock_fetcher.get_nifty_next_50(),
            "3": await self.stock_fetcher.get_nifty_100(),
            "4": await self.stock_fetcher.get_nifty_200(),
            "5": await self.stock_fetcher.get_nifty_500(),
            "12": await self.stock_fetcher.get_all_stocks(),
            "14": await self.stock_fetcher.get_fno_stocks(),
            "15": await self.stock_fetcher.get_sp500_stocks(),
        }
        
        return index_mapping.get(request.index_type, [])

    async def _screen_stocks(
        self, 
        job_id: str, 
        stock_codes: List[str], 
        request: ScreeningRequest, 
        config: Optional[ScreeningConfig],
        db: Session
    ) -> List[StockResult]:
        """Screen individual stocks based on criteria"""
        results = []
        total_stocks = len(stock_codes)
        
        for i, stock_code in enumerate(stock_codes):
            try:
                # Update progress
                progress = int((i / total_stocks) * 100)
                job = db.query(ScreeningJobModel).filter(ScreeningJobModel.job_id == job_id).first()
                if job:
                    job.progress = progress
                    job.screened_stocks = i + 1
                    db.commit()
                
                # Check if job was cancelled
                if job and job.status == ScreeningJobStatus.CANCELLED:
                    break
                
                # Fetch and analyze stock data
                stock_data = await self.stock_fetcher.get_stock_data(stock_code)
                if stock_data is None or stock_data.empty:
                    continue
                
                # Apply screening criteria
                result = await self.stock_analyzer.analyze_stock(
                    stock_code, stock_data, request, config
                )
                
                if result:
                    results.append(result)
                
                # Small delay to prevent overwhelming APIs
                await asyncio.sleep(0.1)
                
            except Exception as e:
                print(f"Error screening {stock_code}: {e}")
                continue
        
        return results

    async def cancel_job(self, job_id: str):
        """Cancel a running screening job"""
        db = get_db_sync()
        try:
            job = db.query(ScreeningJobModel).filter(ScreeningJobModel.job_id == job_id).first()
            if job and job.status == ScreeningJobStatus.RUNNING:
                job.status = ScreeningJobStatus.CANCELLED
                job.completed_at = datetime.utcnow()
                db.commit()
        finally:
            db.close()