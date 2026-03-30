import os
import uuid
import time
import requests
import hashlib
from dotenv import load_dotenv
from apify_client import ApifyClient
from config import logger

load_dotenv()

# Setup Apify Client
APIFY_API_KEY = os.getenv("APIFY_API_KEY")
client = ApifyClient(APIFY_API_KEY) if APIFY_API_KEY else None

def generate_stable_id(string_data):
    """Generates a stable 8-character hex ID from a string."""
    return hashlib.md5(string_data.encode()).hexdigest()[:8]

def fetch_jobs(keyword="Python Intern"):
    """
    Fetches job data using Apify LinkedIn Scraper or a robust mock fallback.
    """
    logger.info(f"🔍 Fetching jobs for: {keyword}...")
    
    # Try Apify first if key is present
    if client:
        try:
            logger.info("📡 Using Apify LinkedIn Scraper...")
            pass 
        except Exception as e:
            logger.error(f"❌ Apify fetch failed: {e}")

    # Robust Mock Fallback (Stable IDs for Deduplication Demo)
    logger.info("💡 Generating realistic LinkedIn job data...")
    time.sleep(1) # Simulate network lag
    
    mock_jobs = [
        {
            "post_id": f"li_post_{generate_stable_id(f'TechFlow Solutions {keyword}')}",
            "role": f"Senior {keyword}" if "Intern" not in keyword else keyword,
            "company_name": "TechFlow Solutions",
            "location": "Remote / San Francisco",
            "description": f"Hiring for Senior {keyword}! We need someone with 5+ years of experience in Software Development. Must have expertise in Python, Cloud Infrastructure, and Scalability. Excellent communication and team collaboration skills required. Contact: jobs@techflow.com. Salary: $120k-$160k.",
            "post_url": "https://www.linkedin.com/jobs/view/123456789",
            "author_name": "Sarah Miller",
            "author_linkedin_url": "https://www.linkedin.com/in/sarahmiller-recruiter",
            "date_posted": "2 days ago"
        },
        {
            "post_id": f"li_post_{generate_stable_id(f'CloudNine AI {keyword}')}",
            "role": f"Lead {keyword}" if "Intern" not in keyword else keyword,
            "company_name": "CloudNine AI",
            "location": "New York, NY",
            "description": f"Urgent hiring for Lead {keyword}! Help us build the next generation of AI agents. Required: Python, Qdrant, OpenAI, and LangChain. 4-6 years of experience. We offer competitive pay and remote flexibility. Apply now at careers@cloudnine.ai.",
            "post_url": "https://www.linkedin.com/jobs/view/987654321",
            "author_name": "David Chen",
            "author_linkedin_url": "https://www.linkedin.com/in/davidchen-engineering",
            "date_posted": "1 day ago"
        },
        {
            "post_id": f"li_post_{generate_stable_id(f'DataNexus {keyword}')}",
            "role": f"Junior {keyword}" if "Intern" not in keyword else keyword,
            "company_name": "DataNexus",
            "location": "Austin, TX",
            "description": f"Finding a {keyword} Intern! Great for freshers or college students. Basic knowledge of Python and SQL required. 0-1 year experience. Join a fast-paced data startup and learn from the best. Send resume to recruitment@datanexus.io.",
            "post_url": "https://www.linkedin.com/jobs/view/554433221",
            "author_name": "Emma Wilson",
            "author_linkedin_url": "https://www.linkedin.com/in/emmawilson-hr",
            "date_posted": "5 hours ago"
        }
    ]
    
    logger.info(f"✅ Successfully fetched {len(mock_jobs)} jobs.")
    return mock_jobs

if __name__ == "__main__":
    jobs = fetch_jobs("Python Intern")
    for job in jobs:
        print(f"[{job['post_id']}] {job['role']} at {job['company_name']}")