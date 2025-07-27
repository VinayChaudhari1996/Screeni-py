from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import yfinance as yf
import pandas as pd
import numpy as np

router = APIRouter()

@router.post("/nifty")
async def predict_nifty() -> Dict[str, Any]:
    """AI-based Nifty prediction for next day gap up/down"""
    try:
        # Fetch recent Nifty data
        nifty = yf.download("^NSEI", period="5d", interval="1d", progress=False)
        
        if nifty.empty:
            raise HTTPException(status_code=500, detail="Failed to fetch Nifty data")
        
        # Simple prediction logic (replace with actual ML model)
        recent_close = nifty['Close'].iloc[-1]
        recent_open = nifty['Open'].iloc[-1]
        
        # Mock prediction based on recent price action
        price_change = (recent_close - recent_open) / recent_open * 100
        
        if price_change > 0.5:
            prediction = "BULLISH"
            confidence = min(75 + abs(price_change) * 5, 95)
        elif price_change < -0.5:
            prediction = "BEARISH" 
            confidence = min(75 + abs(price_change) * 5, 95)
        else:
            prediction = "NEUTRAL"
            confidence = 60
        
        return {
            "prediction": prediction,
            "confidence": round(confidence, 1),
            "probability": confidence / 100,
            "data_used": {
                "nifty_close": float(recent_close),
                "nifty_open": float(recent_open),
                "price_change_pct": round(price_change, 2)
            },
            "model_version": "v1-mock"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")