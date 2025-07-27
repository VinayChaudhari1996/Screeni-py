import pandas as pd
import numpy as np
from typing import Optional, Dict, Any
from app.schemas.screening import StockResult, ScreeningRequest, ScreeningConfig

class StockAnalyzer:
    def __init__(self):
        pass
    
    def calculate_rsi(self, prices: pd.Series, period: int = 14) -> pd.Series:
        """Calculate RSI indicator"""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    def calculate_moving_averages(self, prices: pd.Series) -> Dict[str, pd.Series]:
        """Calculate moving averages"""
        return {
            'SMA_50': prices.rolling(window=50).mean(),
            'SMA_200': prices.rolling(window=200).mean(),
            'EMA_50': prices.ewm(span=50).mean(),
            'EMA_200': prices.ewm(span=200).mean()
        }
    
    async def analyze_stock(
        self, 
        symbol: str, 
        data: pd.DataFrame, 
        request: ScreeningRequest,
        config: Optional[ScreeningConfig] = None
    ) -> Optional[StockResult]:
        """Analyze stock based on screening criteria"""
        try:
            if data.empty or len(data) < 50:
                return None
            
            # Calculate technical indicators
            data['RSI'] = self.calculate_rsi(data['Close'])
            mas = self.calculate_moving_averages(data['Close'])
            for key, value in mas.items():
                data[key] = value
            
            # Get latest values
            latest = data.iloc[-1]
            recent_data = data.tail(30)  # Last 30 days
            
            # Basic analysis
            ltp = latest['Close']
            volume_avg = data['Volume'].tail(20).mean()
            volume_ratio = latest['Volume'] / volume_avg if volume_avg > 0 else 1
            
            # Price range analysis
            high_30d = recent_data['High'].max()
            low_30d = recent_data['Low'].min()
            consolidation_range = ((high_30d - low_30d) / high_30d) * 100
            
            # Trend analysis
            if latest['Close'] > latest['SMA_50'] > latest['SMA_200']:
                trend = "Strong Up"
            elif latest['Close'] > latest['SMA_50']:
                trend = "Weak Up"
            elif latest['Close'] < latest['SMA_50'] < latest['SMA_200']:
                trend = "Strong Down"
            else:
                trend = "Sideways"
            
            # MA Signal
            if latest['Close'] > latest['SMA_50'] > latest['SMA_200']:
                ma_signal = "Bullish"
            elif latest['Close'] < latest['SMA_50'] < latest['SMA_200']:
                ma_signal = "Bearish"
            else:
                ma_signal = "Neutral"
            
            # Apply screening criteria
            if not self._meets_criteria(request, ltp, latest['RSI'], volume_ratio, consolidation_range):
                return None
            
            return StockResult(
                stock=symbol,
                consolidating=f"Range = {consolidation_range:.1f}%",
                breaking_out=f"BO: {high_30d:.2f}",
                ltp=f"{ltp:.2f}",
                volume=f"{volume_ratio:.1f}x",
                ma_signal=ma_signal,
                rsi=int(latest['RSI']) if not pd.isna(latest['RSI']) else 50,
                trend=trend,
                pattern=""
            )
            
        except Exception as e:
            print(f"Error analyzing {symbol}: {e}")
            return None
    
    def _meets_criteria(
        self, 
        request: ScreeningRequest, 
        ltp: float, 
        rsi: float, 
        volume_ratio: float,
        consolidation_range: float
    ) -> bool:
        """Check if stock meets screening criteria"""
        # Basic LTP filter
        if ltp < 30 or ltp > 10000:
            return False
        
        # Apply specific criteria based on request
        if request.criteria == "5":  # RSI screening
            if request.rsi_min and request.rsi_max:
                if not (request.rsi_min <= rsi <= request.rsi_max):
                    return False
        
        elif request.criteria == "2":  # Breakout with volume
            if volume_ratio < 2.0:
                return False
        
        elif request.criteria == "3":  # Consolidating stocks
            if consolidation_range > 10:
                return False
        
        return True