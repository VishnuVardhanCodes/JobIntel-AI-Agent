import gspread
from google.oauth2.service_account import Credentials
import json
import os
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


import time

def write_to_sheet(job_json):
    if not sheet:
        logger.error("Google Sheet not initialized. Cannot write data.")
        return

    try:
        data = json.loads(job_json)
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"Writing job to sheet: {data.get('Role')} at {data.get('Company Name')} - {timestamp}")

        # Handle skills properly
        skills = data.get("Primary Skills")
        if isinstance(skills, list):
            skills = ", ".join(skills)

        # Row data (Now with 7 columns including Timestamp)
        row = [
            data.get("Role", "N/A"),
            data.get("Company Name", "N/A"),
            data.get("Location", "N/A"),
            skills if skills else "N/A",
            data.get("Years of Experience", "N/A"),
            data.get("Email", "N/A"),
            timestamp
        ]

        # Append properly under headers
        sheet.append_row(row, value_input_option="USER_ENTERED")
        logger.info(f"✅ Data written to Google Sheet successfully at {timestamp}")
        print(f"✅ Data written to Google Sheet successfully")

    except Exception as e:
        logger.error(f"❌ Failed to write to Google Sheet: {str(e)}")
        logger.error(f"Data attempted: {job_json}")
        print(f"❌ Failed to write to Google Sheet: {e}")