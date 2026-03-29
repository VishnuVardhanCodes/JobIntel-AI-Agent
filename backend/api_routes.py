from fastapi import APIRouter, HTTPException
from config import logger

router = APIRouter()

@router.get("/status")
async def get_status():
    """
    Check the status of the backend API.
    """
    logger.info("Status endpoint requested.")
    return {"status": "JobIntel AI Backend is online."}

@router.post("/scrape")
async def handle_scrape(job_url: str):
    """
    Endpoint for scraping and processing a specific job URL.
    """
    logger.info("Scraping Job URL: %s via API", job_url)
    try:
        # TODO: Link with LinkedInScraper and LyzrAgent
        return {"job_id": job_url, "processed": True}
    except Exception as e:
        logger.error("Error scraping job URL: %s", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/jobs")
async def get_processed_jobs():
    """
    Fetches processed job intelligence.
    """
    logger.info("Fetching all jobs via API.")
    # TODO: Fetch from memory (Qdrant or sheets)
    return []
