import gspread
from google.oauth2.service_account import Credentials
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get sheet ID
GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")

# Google API scope
scope = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

# Load credentials
creds = Credentials.from_service_account_file(
    "backend/service_account.json",
    scopes=scope
)

client = gspread.authorize(creds)

# Open sheet
sheet = client.open_by_key(GOOGLE_SHEET_ID).sheet1


def write_to_sheet(job_json):

    # Convert JSON string to dictionary
    data = json.loads(job_json)

    # Get skills
    skills = data.get("Primary Skills")

    # If skills is string like '["Python","SQL"]'
    if isinstance(skills, str):
        try:
            skills = json.loads(skills)
        except:
            pass

    # If skills is list → convert to string
    if isinstance(skills, list):
        skills = ", ".join(skills)

    # Create row
    row = [
        data.get("Role"),
        data.get("Company Name"),
        data.get("Location"),
        skills,
        data.get("Years of Experience"),
        data.get("Email")
    ]

    # Write row to Google Sheet
    sheet.append_row(row)

    print("✅ Data written to Google Sheet successfully")