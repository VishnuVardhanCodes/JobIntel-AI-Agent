from dotenv import load_dotenv
import os
import litellm

# Load .env
load_dotenv()

# Set Groq key
litellm.api_key = os.getenv("GROQ_API_KEY")
litellm.api_base = "https://api.groq.com/openai/v1"


def extract_job_data(post_text):

    prompt = f"""
    Extract structured job information from this LinkedIn post.

    Return ONLY valid JSON.
    Do NOT return code.
    Do NOT explain anything.
    Do NOT include markdown.
    Return JSON only.

    Fields:
    Role
    Company Name
    Location
    Primary Skills
    Years of Experience
    Email

    LinkedIn Post:
    {post_text}
    """

    response = litellm.completion(
    model="groq/llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response['choices'][0]['message']['content']


# Test
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