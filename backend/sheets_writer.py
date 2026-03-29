import gspread
from google.oauth2.service_account import Credentials
import json
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")

scope = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

creds = Credentials.from_service_account_file(
    "backend/service_account.json",
    scopes=scope
)

client = gspread.authorize(creds)

sheet = client.open_by_key(GOOGLE_SHEET_ID).sheet1


def write_to_sheet(job_json):

    data = json.loads(job_json)

    # Handle skills properly
    skills = data.get("Primary Skills")

    if isinstance(skills, list):
        skills = ", ".join(skills)

    # Row data
    row = [
        data.get("Role"),
        data.get("Company Name"),
        data.get("Location"),
        skills,
        data.get("Years of Experience"),
        data.get("Email")
    ]

    # Append properly under headers
    sheet.append_row(row, value_input_option="USER_ENTERED")

    print("✅ Data written to Google Sheet successfully")