from fastapi import FastAPI
from api_routes import router as api_router
from config import logger

# Initialize FastAPI App
app = FastAPI(
    title="JobIntel AI Backend",
    description="Automated LinkedIn Job Intelligence and Analysis Platform",
)

# Include the modular API routes
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """
    Log app startup and initialize dependencies.
    """
    logger.info("JobIntel AI Backend Starting Up...")
    # TODO: Add logic for pre-loading models or connecting to DBs

@app.on_event("shutdown")
async def shutdown_event():
    """
    Log app shutdown and cleanup resources.
    """
    logger.info("JobIntel AI Backend Shutting Down...")

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
