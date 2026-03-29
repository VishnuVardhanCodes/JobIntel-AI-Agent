import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Centralized Logging System
def setup_logging():
    """
    Sets up the logging configuration for the entire application.
    """
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler("app.log")
        ]
    )
    logger = logging.getLogger("JobIntel-AI")
    logger.info("Logging initialized Successfully.")
    return logger

# Initialize logger
logger = setup_logging()

class Config:
    """
    Configuration class to manage project-wide variables.
    """
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    LYZR_API_KEY = os.getenv("LYZR_API_KEY")
    APIFY_API_KEY = os.getenv("APIFY_API_KEY")
    
    # Qdrant Config
    QDRANT_URL = os.getenv("QDRANT_URL")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
    
    # Google Sheets Config
    GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
    GOOGLE_CREDENTIALS_FILE = os.getenv("GOOGLE_CREDENTIALS_FILE", "service_account.json")
    
    # LinkedIn Credentials (Optional)
    LINKEDIN_USERNAME = os.getenv("LINKEDIN_USERNAME")
    LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")

# Create a global config instance
config = Config()
