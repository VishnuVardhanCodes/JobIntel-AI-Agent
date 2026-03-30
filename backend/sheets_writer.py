import gspread
from google.oauth2.service_account import Credentials
import json
import os
import time
from dotenv import load_dotenv
from config import logger

load_dotenv()

GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")

scope = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, "service_account.json")

creds = Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE,
    scopes=scope
)

client = gspread.authorize(creds)

# Ensure the Sheet ID is present
if GOOGLE_SHEET_ID:
    try:
        sheet = client.open_by_key(GOOGLE_SHEET_ID).sheet1
    except Exception as e:
        logger.error(f"Failed to open Google Sheet with ID {GOOGLE_SHEET_ID}: {e}")
        sheet = None
else:
    logger.warning("GOOGLE_SHEET_ID not found in .env")
    sheet = None

def setup_headers():
    """
    Ensures the Google Sheet has the exact 18 headers required.
    """
    if not sheet:
        return
    
    headers = [
        "post_id", "role", "company_name", "location", "primary_skills", 
        "secondary_skills", "must_to_have", "years_of_experience", 
        "looking_for_college_students", "intern", "salary_package", 
        "email", "phone", "hiring_intent", "author_name", 
        "author_linkedin_url", "post_url", "date_posted", "keyword_matched",
        "date_processed"
    ]
    
    try:
        # Check if headers already exist
        first_row = sheet.row_values(1)
        if not first_row or first_row[0] != "post_id":
            sheet.insert_row(headers, index=1)
            logger.info("✅ Google Sheet headers initialized.")
    except Exception as e:
        logger.error(f"Failed to setup headers: {e}")

def write_to_sheet(job_data):
    """
    Writes a single job record to the Google Sheet.
    """
    if not sheet:
        logger.error("Google Sheet not initialized. Cannot write data.")
        return

    try:
        if isinstance(job_data, str):
            data = json.loads(job_data)
        else:
            data = job_data

        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

        # Map list fields to strings
        def list_to_str(val):
            if isinstance(val, list):
                return ", ".join(val)
            return str(val)

        # Construct row according to 19 columns (18 fields + timestamp)
        row = [
            data.get("post_id", "Not specified"),
            data.get("role", "Not specified"),
            data.get("company_name", "Not specified"),
            data.get("location", "Not specified"),
            list_to_str(data.get("primary_skills", [])),
            list_to_str(data.get("secondary_skills", [])),
            list_to_str(data.get("must_to_have", [])),
            data.get("years_of_experience", "Not specified"),
            data.get("looking_for_college_students", "Not specified"),
            data.get("intern", "Not specified"),
            data.get("salary_package", "Not specified"),
            data.get("email", "Not specified"),
            data.get("phone", "Not specified"),
            data.get("hiring_intent", "Not specified"),
            data.get("author_name", "Not specified"),
            data.get("author_linkedin_url", "Not specified"),
            data.get("post_url", "Not specified"),
            data.get("date_posted", "Not specified"),
            data.get("keyword_matched", "Not specified"),
            timestamp
        ]

        # Append properly
        sheet.append_row(row, value_input_option="USER_ENTERED")
        logger.info(f"✅ Data for {data.get('post_id')} written to Google Sheet.")

    except Exception as e:
        logger.error(f"❌ Failed to write to Google Sheet: {str(e)}")

# Initialize headers on load
setup_headers()