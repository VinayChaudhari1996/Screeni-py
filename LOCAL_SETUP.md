# Local Development Setup Guide

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

## Backend Setup (FastAPI)

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create and activate virtual environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment setup
The `.env` file is already created with development settings. You can modify it if needed.

### 5. Start the backend server
```bash
# From the backend directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: http://localhost:8000
API documentation will be available at: http://localhost:8000/docs

## Frontend Setup (React)

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install shadcn/ui components
```bash
# Initialize shadcn/ui (if not already done)
npx shadcn-ui@latest init

# Install required components
npx shadcn-ui@latest add button card form input select table badge
npx shadcn-ui@latest add dropdown-menu popover calendar progress
npx shadcn-ui@latest add tabs dialog alert-dialog
```

### 4. Environment setup
Create `.env` file in frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Screenipy
VITE_APP_VERSION=2.0.0
```

### 5. Start the frontend development server
```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

## Testing the Setup

1. **Backend Health Check**: Visit http://localhost:8000/health
2. **API Documentation**: Visit http://localhost:8000/docs
3. **Frontend Application**: Visit http://localhost:5173

## Available Features

### Currently Working:
- ✅ Stock screening with basic criteria
- ✅ Nifty prediction (mock implementation)
- ✅ Real-time progress tracking
- ✅ Results table with filtering
- ✅ Responsive UI with shadcn/ui components

### In Development:
- 🔄 Similar stock search
- 🔄 Position size calculator
- 🔄 Advanced configuration panel
- 🔄 Data export functionality

## Development Workflow

1. **Backend Changes**: 
   - Modify files in `backend/app/`
   - Server auto-reloads with `--reload` flag
   - Test API endpoints at http://localhost:8000/docs

2. **Frontend Changes**:
   - Modify files in `frontend/src/`
   - Vite provides hot module replacement
   - Changes reflect immediately in browser

## Troubleshooting

### Common Issues:

1. **CORS Errors**: 
   - Ensure backend `.env` has correct `ALLOWED_HOSTS`
   - Check frontend is running on allowed port

2. **Module Import Errors**:
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` again

3. **Frontend Build Errors**:
   - Delete `node_modules` and run `npm install` again
   - Check Node.js version (should be 18+)

4. **API Connection Issues**:
   - Verify backend is running on port 8000
   - Check `VITE_API_BASE_URL` in frontend `.env`

### Getting Help:

- Check browser console for frontend errors
- Check terminal output for backend errors
- Verify both servers are running simultaneously
- Test API endpoints directly using the Swagger UI

## Next Steps

Once you have the basic setup running:

1. Test the stock screening functionality
2. Try the Nifty prediction feature
3. Explore the API documentation
4. Customize the configuration as needed
5. Add additional features based on your requirements

The application maintains the core functionality of the original Streamlit version while providing a modern, scalable architecture for future enhancements.