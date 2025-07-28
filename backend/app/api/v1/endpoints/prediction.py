from fastapi import APIRouter
from typing import Dict, Any
import random

router = APIRouter()

@router.post("/nifty")
async def predict_nifty() -> Dict[str, Any]:
    """AI-based Nifty prediction for next day gap up/down"""
    try:
        # Mock prediction logic
        predictions = ["BULLISH", "BEARISH"]
        prediction = random.choice(predictions)
        confidence = random.uniform(65, 85)
        
        return {
            "prediction": prediction,
            "confidence": round(confidence, 1),
            "probability": confidence / 100,
            "data_used": {
                "nifty_close": round(random.uniform(19000, 20000), 2),
                "nifty_open": round(random.uniform(19000, 20000), 2),
                "price_change_pct": round(random.uniform(-2, 2), 2)
            },
            "model_version": "v3-demo"
        }
        
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}