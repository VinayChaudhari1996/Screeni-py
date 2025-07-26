# Screenipy Migration Setup Instructions

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- Docker (optional, for containerized deployment)
- Git

## Backend Setup (FastAPI)

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Create `.env` file in backend directory:
```env
# App Settings
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=your-super-secret-key-here

# Database
DATABASE_URL=sqlite:///./screenipy.db

# Redis (for job queue and caching)
REDIS_URL=redis://localhost:6379

# CORS
ALLOWED_HOSTS=["http://localhost:3000", "http://localhost:5173"]

# External APIs
YAHOO_FINANCE_TIMEOUT=10
NSE_TIMEOUT=10

# ML Models
MODEL_PATH=./models
CHROMADB_PATH=./chromadb_store
```

### 4. Initialize Database
```bash
# Run database migrations
alembic upgrade head

# Or for development, create tables directly
python -c "from app.core.database import init_db; import asyncio; asyncio.run(init_db())"
```

### 5. Start Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup (React + shadcn/ui)

### 1. Create React Project
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup shadcn/ui
```bash
npx shadcn-ui@latest init
```

When prompted, choose:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes

### 4. Install shadcn/ui Components
```bash
npx shadcn-ui@latest add button card form input select table badge
npx shadcn-ui@latest add dropdown-menu popover calendar
npx shadcn-ui@latest add tabs dialog alert-dialog progress
```

### 5. Environment Configuration
Create `.env` file in frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_BASE_URL=ws://localhost:8000
VITE_APP_NAME=Screenipy
VITE_APP_VERSION=2.0.0
```

### 6. Start Development Server
```bash
npm run dev
```

## Database Migration from Streamlit

### 1. Export Existing Data
```python
# Run this script in your existing Streamlit environment
import pandas as pd
import pickle
import json
from pathlib import Path

# Export configuration
config_data = {
    "period": "300d",
    "days_to_lookback": 30,
    "duration": "1d",
    "min_price": 30.0,
    "max_price": 10000.0,
    "volume_ratio": 2.0,
    "consolidation_percentage": 10,
    "shuffle": True,
    "cache_enabled": True,
    "stage_two_only": True,
    "use_ema": False
}

with open('config_export.json', 'w') as f:
    json.dump(config_data, f, indent=2)

# Export any cached stock data
cache_files = list(Path('.').glob('stock_data_*.pkl'))
for cache_file in cache_files:
    print(f"Found cache file: {cache_file}")
    # You can process these files as needed

print("Data export completed!")
```

### 2. Import Data to New Backend
```python
# Run this script after setting up the new backend
import json
import asyncio
from app.core.database import get_db
from app.models.config import UserConfig

async def import_config():
    with open('config_export.json', 'r') as f:
        config_data = json.load(f)
    
    # Create default user config in new database
    # Implementation depends on your user model
    print("Configuration imported successfully!")

if __name__ == "__main__":
    asyncio.run(import_config())
```

## Docker Deployment (Optional)

### 1. Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Frontend Dockerfile
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/screenipy
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=screenipy
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## Testing Setup

### Backend Testing
```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest tests/ -v
```

### Frontend Testing
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
npm run test
```

## Production Deployment

### 1. Environment Variables
Update production environment variables:
- Set `ENVIRONMENT=production`
- Use secure `SECRET_KEY`
- Configure production database URL
- Set up proper CORS origins
- Configure logging levels

### 2. Security Considerations
- Enable HTTPS
- Set up proper authentication
- Configure rate limiting
- Set up monitoring and logging
- Regular security updates

### 3. Performance Optimization
- Enable Redis caching
- Set up CDN for static assets
- Configure database connection pooling
- Implement proper error handling
- Set up health checks

## Migration Checklist

- [ ] Backend API endpoints implemented
- [ ] Database models and migrations created
- [ ] Frontend components developed
- [ ] API integration completed
- [ ] WebSocket real-time updates working
- [ ] Data migration from Streamlit completed
- [ ] Testing suite implemented
- [ ] Docker containers configured
- [ ] Production deployment ready
- [ ] Documentation updated
- [ ] User training materials prepared

## Support and Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `ALLOWED_HOSTS` includes your frontend URL
2. **Database Connection**: Check database URL and credentials
3. **WebSocket Issues**: Verify WebSocket URL and connection handling
4. **Import Errors**: Ensure all dependencies are installed
5. **Build Failures**: Check Node.js and Python versions

### Getting Help

- Check the API documentation at `http://localhost:8000/docs`
- Review browser console for frontend errors
- Check backend logs for API issues
- Refer to the original Streamlit code for business logic
- Create issues in the project repository

This migration provides a solid foundation for scaling the Screenipy application while maintaining all existing functionality and improving the user experience significantly.