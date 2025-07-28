from fastapi import APIRouter
from typing import Dict

router = APIRouter()

@router.get("/indices")
async def get_available_indices() -> Dict[str, str]:
    """Get all available stock indices"""
    return {
        "12": "All Stocks (Default)",
        "0": "By Stock Names (NSE Stock Code)",
        "1": "Nifty 50",
        "2": "Nifty Next 50", 
        "3": "Nifty 100",
        "4": "Nifty 200",
        "5": "Nifty 500",
        "6": "Nifty Smallcap 50",
        "7": "Nifty Smallcap 100",
        "8": "Nifty Smallcap 250",
        "9": "Nifty Midcap 50",
        "10": "Nifty Midcap 100",
        "11": "Nifty Midcap 150",
        "13": "Newly Listed (IPOs in last 2 Year)",
        "14": "F&O Stocks Only",
        "15": "US S&P 500",
        "16": "Sectoral Indices (NSE)"
    }