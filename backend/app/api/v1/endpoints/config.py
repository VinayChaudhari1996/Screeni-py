from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ScreeningConfig(BaseModel):
    period: str = "300d"
    days_to_lookback: int = 30
    duration: str = "1d"
    min_price: float = 30.0
    max_price: float = 10000.0
    volume_ratio: float = 2.0
    consolidation_percentage: int = 10
    shuffle: bool = True
    cache_enabled: bool = True
    stage_two_only: bool = True
    use_ema: bool = False

# In-memory config storage
current_config = ScreeningConfig()

@router.get("/", response_model=ScreeningConfig)
async def get_config():
    """Get current screening configuration"""
    return current_config

@router.put("/", response_model=ScreeningConfig)
async def update_config(config: ScreeningConfig):
    """Update screening configuration"""
    global current_config
    current_config = config
    return current_config