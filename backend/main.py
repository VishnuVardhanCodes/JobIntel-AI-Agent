from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api_routes import router as api_router
from config import logger
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("JobIntel AI Backend Starting Up...")
    yield
    # Shutdown logic
    logger.info("JobIntel AI Backend Shutting Down...")

# Initialize FastAPI App
app = FastAPI(
    title="JobIntel AI Backend",
    description="Automated LinkedIn Job Intelligence and Analysis Platform",
    lifespan=lifespan
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the modular API routes (No prefix to match frontend calls)
app.include_router(api_router)

@app.get("/")
async def root():
    """
    Root endpoint for checking backend accessibility.
    """
    return {"message": "Welcome to JobIntel AI Backend API"}

if __name__ == "__main__":
    import uvicorn
    # Start the application using uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
