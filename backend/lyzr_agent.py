import json
import re
import os
import litellm
from dotenv import load_dotenv
from config import logger

# Load environment variables
load_dotenv()

# Setup Groq API
litellm.api_key = os.getenv("GROQ_API_KEY")

# Remove HTML tags
def clean_text(text):
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# Email fallback detection
def extract_email(text):
    match = re.search(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
        text
    )
    if match:
        return match.group()
    return "Not Provided"

# Extract only JSON block safely
def extract_json(text):
    try:
        # Find first { and last }
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            json_text = text[start:end+1]
            # Strip potential escape sequences or invalid whitespace
            json_text = json_text.strip()
            return json.loads(json_text)
    except Exception as e:
        logger.error(f"JSON Parse Error: {e} - Raw text: {text}")
    return None

# Main extraction
def extract_job_data(post_text):
    # Clean HTML
    post_text = clean_text(post_text)
    # Limit size
    post_text = post_text[:2000]

    prompt = f"""
Extract structured job information from the following text.
Return ONLY a valid JSON object. Do not include markdown or explanations.

Fields Required:
- Role
- Company Name
- Location
- Primary Skills (list)
- Years of Experience
- Email (if not found, use "Not Provided")

Job Description:
{post_text}
"""

    try:
        logger.info("📡 Dispatching extraction request to Groq...")
        response = litellm.completion(
            model="groq/llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a professional recruiting assistant. You always respond in valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1 # Low temperature for consistent JSON
        )

        result_text = response['choices'][0]['message']['content']
        logger.debug(f"Raw AI Response: {result_text}")

        # Extract JSON safely
        data = extract_json(result_text)

        if not data:
            logger.warning("⚠️ JSON extraction failed. Falling back to simple parsing.")
            raise Exception("AI response was not valid JSON")

        # Basic verification and email fallback
        if data.get("Email") in [None, "", "Not Provided"]:
            data["Email"] = extract_email(post_text)

        # Force correct types
        if not isinstance(data.get("Primary Skills"), list):
            data["Primary Skills"] = [str(data.get("Primary Skills", "Not Provided"))]

        return json.dumps(data)

    except Exception as e:
        logger.error(f"❌ Extraction failed: {str(e)}")
        
        fallback = {
            "Role": "Not Provided",
            "Company Name": "Not Provided",
            "Location": "Not Provided",
            "Primary Skills": ["Not Provided"],
            "Years of Experience": "Not Provided",
            "Email": extract_email(post_text)
        }
        return json.dumps(fallback)


# Test block
if __name__ == "__main__":

    test_post = """
    Hiring Python Intern at ABC Tech, Hyderabad.
    Skills: Python, FastAPI, SQL.
    Experience: 0-1 years.
    Send resume to hr@abctech.com
    """

    result = extract_job_data(test_post)

    print("\nExtracted Data:\n")
    print(result)