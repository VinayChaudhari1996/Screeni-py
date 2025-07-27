from fastapi import APIRouter
from app.api.v1.endpoints import screening, stocks, prediction, config

api_router = APIRouter()

api_router.include_router(screening.router, prefix="/screening", tags=["screening"])
api_router.include_router(stocks.router, prefix="/stocks", tags=["stocks"])
api_router.include_router(prediction.router, prefix="/prediction", tags=["prediction"])
api_router.include_router(config.router, prefix="/config", tags=["configuration"])