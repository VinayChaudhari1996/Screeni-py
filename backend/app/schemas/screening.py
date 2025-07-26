from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any, Literal
from datetime import date, datetime
from enum import Enum

class IndexType(str, Enum):
    ALL_STOCKS = "12"
    BY_STOCK_NAME = "0"
    NIFTY_50 = "1"
    NIFTY_NEXT_50 = "2"
    NIFTY_100 = "3"
    NIFTY_200 = "4"
    NIFTY_500 = "5"
    NIFTY_SMALLCAP_50 = "6"
    NIFTY_SMALLCAP_100 = "7"
    NIFTY_SMALLCAP_250 = "8"
    NIFTY_MIDCAP_50 = "9"
    NIFTY_MIDCAP_100 = "10"
    NIFTY_MIDCAP_150 = "11"
    NEWLY_LISTED = "13"
    FNO_STOCKS = "14"
    US_SP500 = "15"
    SECTORAL_INDICES = "16"

class ScreeningCriteria(str, Enum):
    FULL_SCREENING = "0"
    BREAKOUT_CONSOLIDATION = "1"
    BREAKOUT_VOLUME = "2"
    CONSOLIDATING = "3"
    LOWEST_VOLUME = "4"
    RSI_SCREENING = "5"
    REVERSAL_SIGNALS = "6"
    CHART_PATTERNS = "7"

class ReversalType(str, Enum):
    BUY_SIGNAL = "1"
    SELL_SIGNAL = "2"
    MOMENTUM_GAINERS = "3"
    MA_REVERSAL = "4"
    VSA_REVERSAL = "5"
    NARROW_RANGE = "6"
    LORENTZIAN = "7"
    RSI_MA_CROSSING = "8"

class ChartPattern(str, Enum):
    BULLISH_INSIDE_BAR = "1"
    BEARISH_INSIDE_BAR = "2"
    CONFLUENCE = "3"
    VCP = "4"
    TRENDLINE_SUPPORT = "5"

class ScreeningRequest(BaseModel):
    index_type: IndexType
    criteria: ScreeningCriteria
    stock_codes: Optional[List[str]] = None
    backtest_date: Optional[date] = None
    
    # Criteria-specific parameters
    rsi_min: Optional[int] = Field(None, ge=0, le=100)
    rsi_max: Optional[int] = Field(None, ge=0, le=100)
    volume_days: Optional[int] = Field(None, ge=1, le=100)
    reversal_type: Optional[ReversalType] = None
    ma_length: Optional[int] = Field(None, ge=1, le=200)
    nr_range: Optional[int] = Field(None, ge=1, le=14)
    chart_pattern: Optional[ChartPattern] = None
    lookback_candles: Optional[int] = Field(None, ge=1, le=50)
    confluence_percentage: Optional[float] = Field(None, ge=0.1, le=5.0)
    
    @validator('rsi_max')
    def validate_rsi_range(cls, v, values):
        if v is not None and 'rsi_min' in values and values['rsi_min'] is not None:
            if v <= values['rsi_min']:
                raise ValueError('rsi_max must be greater than rsi_min')
        return v

class ScreeningConfig(BaseModel):
    period: str = "300d"
    days_to_lookback: int = Field(30, ge=1, le=100)
    duration: str = "1d"
    min_price: float = Field(30.0, ge=0.1)
    max_price: float = Field(10000.0, ge=1.0)
    volume_ratio: float = Field(2.0, ge=0.1)
    consolidation_percentage: int = Field(10, ge=1, le=50)
    shuffle: bool = True
    cache_enabled: bool = True
    stage_two_only: bool = True
    use_ema: bool = False

class StockResult(BaseModel):
    stock: str
    consolidating: str
    breaking_out: str
    ltp: str
    volume: str
    ma_signal: str
    rsi: int
    trend: str
    pattern: str
    # Backtest results (optional)
    t_plus_1d: Optional[str] = None
    t_plus_1wk: Optional[str] = None
    t_plus_1mo: Optional[str] = None
    t_plus_6mo: Optional[str] = None
    t_plus_1y: Optional[str] = None
    t_plus_52wk_high: Optional[str] = None
    t_plus_52wk_low: Optional[str] = None

class ScreeningJobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class ScreeningJob(BaseModel):
    job_id: str
    status: ScreeningJobStatus
    progress: int = Field(0, ge=0, le=100)
    total_stocks: Optional[int] = None
    screened_stocks: Optional[int] = None
    found_stocks: Optional[int] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

class ScreeningResponse(BaseModel):
    job_id: str
    status: ScreeningJobStatus
    results: Optional[List[StockResult]] = None
    total_found: Optional[int] = None
    execution_time: Optional[float] = None
    config_used: Optional[ScreeningConfig] = None

class SimilaritySearchRequest(BaseModel):
    stock_code: str = Field(..., min_length=1, max_length=20)
    lookback_candles: int = Field(30, ge=1, le=100)

class SimilaritySearchResponse(BaseModel):
    query_stock: str
    similar_stocks: List[StockResult]
    similarity_scores: List[float]

class NiftyPredictionResponse(BaseModel):
    prediction: str  # "BULLISH" or "BEARISH"
    confidence: float = Field(..., ge=0, le=100)
    probability: float = Field(..., ge=0, le=1)
    data_used: Dict[str, Any]
    model_version: str = "v3"