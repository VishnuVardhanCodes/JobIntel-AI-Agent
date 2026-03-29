from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from config import logger
from main_pipeline import run_pipeline
from state import agent_state
import json

router = APIRouter()

class RunAgentRequest(BaseModel):
    keyword: str

@router.get("/status")
async def get_status():
    """
    Returns agent status
    """
    logger.info("Status endpoint requested.")
    # Add jobs list to status if needed, but we have a separate /jobs
    return agent_state.get_dict()

@router.post("/run-agent")
async def handle_run_agent(request: RunAgentRequest, background_tasks: BackgroundTasks):
    """
    Runs the job extraction pipeline
    """
    logger.info("Running agent for keyword: %s", request.keyword)
    
    # Run in background to avoid timeout
    # run_pipeline now handles its own status via agent_state.start/stop_running()
    background_tasks.add_task(run_pipeline, request.keyword)
    
    return {"message": "Agent started successfully", "keyword": request.keyword}

@router.get("/jobs")
async def get_jobs():
    """
    Returns processed jobs
    """
    logger.info("Fetching all jobs via API.")
    return agent_state.jobs
