import yfinance as yf
import pandas as pd
import requests
from typing import List, Optional
import asyncio

class StockFetcher:
    def __init__(self):
        self.timeout = 10
    
    async def get_stock_data(self, symbol: str, period: str = "300d") -> Optional[pd.DataFrame]:
        """Fetch stock data from Yahoo Finance"""
        try:
            # Add .NS suffix for NSE stocks if not present
            if not symbol.endswith('.NS') and not symbol.startswith('^'):
                symbol = f"{symbol}.NS"
            
            stock = yf.Ticker(symbol)
            data = stock.history(period=period, timeout=self.timeout)
            
            return data if not data.empty else None
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
            return None
    
    async def get_nifty_50(self) -> List[str]:
        """Get Nifty 50 stock list"""
        # Mock data - replace with actual NSE API call
        return [
            "RELIANCE", "TCS", "HDFCBANK", "INFY", "HINDUNILVR",
            "ICICIBANK", "KOTAKBANK", "SBIN", "BHARTIARTL", "ITC",
            "ASIANPAINT", "LT", "AXISBANK", "MARUTI", "SUNPHARMA",
            "TITAN", "ULTRACEMCO", "NESTLEIND", "WIPRO", "M&M",
            "NTPC", "HCLTECH", "POWERGRID", "TATAMOTORS", "BAJFINANCE",
            "TECHM", "ONGC", "TATASTEEL", "ADANIPORTS", "COALINDIA",
            "INDUSINDBK", "DRREDDY", "GRASIM", "JSWSTEEL", "HINDALCO",
            "CIPLA", "EICHERMOT", "HEROMOTOCO", "BAJAJFINSV", "UPL",
            "BRITANNIA", "DIVISLAB", "APOLLOHOSP", "TATACONSUM", "BAJAJ-AUTO",
            "HDFCLIFE", "SBILIFE", "BPCL", "SHREECEM", "IOC"
        ]
    
    async def get_all_stocks(self) -> List[str]:
        """Get all NSE stocks - simplified version"""
        # In production, fetch from NSE API
        nifty_50 = await self.get_nifty_50()
        # Add more stocks for demo
        additional_stocks = [
            "ADANIENT", "ADANIGREEN", "ADANIPOWER", "AMBUJACEM", "BANKBARODA",
            "BERGEPAINT", "BIOCON", "BOSCHLTD", "CADILAHC", "CANBK"
        ]
        return nifty_50 + additional_stocks