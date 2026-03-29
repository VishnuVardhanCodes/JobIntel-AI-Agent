from dotenv import load_dotenv
import os
import litellm
import json
import re

# Load environment variables
load_dotenv()

# Setup Groq API
litellm.api_key = os.getenv("GROQ_API_KEY")
litellm.api_base = "https://api.groq.com/openai/v1"


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

            return json.loads(json_text)

    except Exception:
        pass

    return None


# Main extraction
def extract_job_data(post_text):

    # Clean HTML
    post_text = clean_text(post_text)

    # Limit size
    post_text = post_text[:2000]

    prompt = f"""
Extract structured job information.

Return ONLY JSON.

Fields:

Role
Company Name
Location
Primary Skills
Years of Experience
Email

Rules:

- No explanation
- No markdown
- JSON only

Job Description:
{post_text}
"""

    try:

        response = litellm.completion(
            model="groq/llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        result_text = response['choices'][0]['message']['content']

        # Extract JSON safely
        data = extract_json(result_text)

        if not data:

            raise Exception("JSON extraction failed")

        # Email fallback
        if data.get("Email") in [None, "", "Not Provided"]:

            email = extract_email(post_text)

            data["Email"] = email

        return json.dumps(data)

    except Exception as e:

        print("⚠️ Extraction failed:", e)

        fallback = {
            "Role": "Not Provided",
            "Company Name": "Not Provided",
            "Location": "Not Provided",
            "Primary Skills": "Not Provided",
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