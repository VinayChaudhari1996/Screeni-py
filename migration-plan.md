# Screenipy Migration Plan: Streamlit to FastAPI + React

## Overview
Migrate the existing Streamlit-based stock screening application to a modern architecture with FastAPI backend and React frontend using shadcn/ui components.

## Phase 1: Backend API Development (FastAPI)

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── endpoints/
│   │       │   ├── __init__.py
│   │       │   ├── screening.py
│   │       │   ├── stocks.py
│   │       │   ├── prediction.py
│   │       │   ├── similarity.py
│   │       │   └── config.py
│   │       └── api.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── stock.py
│   │   ├── screening.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── stock.py
│   │   ├── screening.py
│   │   └── response.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── stock_fetcher.py
│   │   ├── screener.py
│   │   ├── predictor.py
│   │   └── similarity.py
│   └── utils/
│       ├── __init__.py
│       ├── technical_analysis.py
│       └── helpers.py
├── tests/
├── requirements.txt
└── Dockerfile
```

### Key API Endpoints
- `POST /api/v1/screening/run` - Execute stock screening
- `GET /api/v1/stocks/indices` - Get available stock indices
- `POST /api/v1/prediction/nifty` - AI-based Nifty prediction
- `POST /api/v1/similarity/search` - Find similar stocks
- `GET /api/v1/config` - Get user configuration
- `PUT /api/v1/config` - Update user configuration
- `GET /api/v1/screening/results/{job_id}` - Get screening results
- `GET /api/v1/screening/status/{job_id}` - Get screening progress

## Phase 2: Frontend Development (React + shadcn/ui)

### Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/ (shadcn/ui components)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Layout.tsx
│   │   ├── screening/
│   │   │   ├── ScreeningForm.tsx
│   │   │   ├── ResultsTable.tsx
│   │   │   └── ProgressTracker.tsx
│   │   ├── prediction/
│   │   │   └── NiftyPredictor.tsx
│   │   ├── similarity/
│   │   │   └── SimilaritySearch.tsx
│   │   ├── config/
│   │   │   └── ConfigurationPanel.tsx
│   │   └── calculator/
│   │       └── PositionSizeCalculator.tsx
│   ├── hooks/
│   │   ├── useScreening.ts
│   │   ├── useWebSocket.ts
│   │   └── useConfig.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── websocket.ts
│   ├── types/
│   │   ├── stock.ts
│   │   ├── screening.ts
│   │   └── api.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Screening.tsx
│   │   ├── Prediction.tsx
│   │   ├── Similarity.tsx
│   │   ├── Configuration.tsx
│   │   └── Calculator.tsx
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── Dockerfile
```

## Phase 3: Implementation Steps

### Step 1: Backend Setup
1. Initialize FastAPI project with proper structure
2. Set up database models and migrations
3. Implement core business logic services
4. Create API endpoints with proper validation
5. Add authentication and authorization
6. Implement WebSocket for real-time updates
7. Add comprehensive error handling and logging

### Step 2: Frontend Setup
1. Initialize React project with Vite and TypeScript
2. Install and configure shadcn/ui components
3. Set up routing with React Router
4. Implement state management with Zustand
5. Create reusable UI components
6. Implement API integration with React Query
7. Add responsive design and accessibility

### Step 3: Data Migration
1. Export existing configuration and user data
2. Set up database schema for new backend
3. Create migration scripts for data transfer
4. Implement data validation and cleanup

### Step 4: Testing and Deployment
1. Unit tests for backend services
2. Integration tests for API endpoints
3. Frontend component testing with Jest/RTL
4. E2E testing with Playwright
5. Docker containerization
6. CI/CD pipeline setup
7. Production deployment strategy

## Benefits of Migration

### Technical Benefits
- **Scalability**: Separate backend can handle multiple clients
- **Performance**: Optimized API responses and caching
- **Maintainability**: Clear separation of concerns
- **Modern Stack**: Latest React features and TypeScript
- **Real-time Updates**: WebSocket support for live data
- **Mobile Responsive**: Better mobile experience with shadcn/ui

### User Experience Benefits
- **Faster Loading**: Optimized bundle sizes and lazy loading
- **Better UX**: Modern, intuitive interface
- **Offline Support**: Service worker for offline functionality
- **Progressive Web App**: PWA capabilities
- **Accessibility**: WCAG compliant components

## Timeline Estimate
- **Phase 1 (Backend)**: 4-6 weeks
- **Phase 2 (Frontend)**: 6-8 weeks
- **Phase 3 (Integration & Testing)**: 2-3 weeks
- **Total**: 12-17 weeks

## Risk Mitigation
- Maintain existing Streamlit app during migration
- Implement feature parity testing
- Gradual rollout with user feedback
- Rollback plan if issues arise
- Comprehensive documentation and training