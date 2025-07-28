import asyncio

async def init_db():
    """Initialize database - simplified for local development"""
    print("Database initialized (using in-memory storage for demo)")
    return True