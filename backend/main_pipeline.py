import json
from linkedin_fetch import fetch_jobs
from lyzr_agent import extract_job_data
from qdrant_memory import check_duplicate, store_job
from sheets_writer import write_to_sheet
from state import agent_state
from config import logger

def run_pipeline(keyword="Python Intern"):
    """
    Main orchestration logic for JobIntel AI.
    LinkedIn Fetch -> LLM Extraction -> Qdrant Dedupe -> Google Sheets
    """
    agent_state.start_running()
    logger.info(f"🚀 Starting JobIntel Pipeline for: {keyword}...")

    try:
        # 1. Fetch Jobs from LinkedIn (via Apify/Mock)
        jobs = fetch_jobs(keyword)

        if not jobs:
            logger.warning(f"❌ No jobs fetched for {keyword}")
            agent_state.stop_running()
            return

        agent_state.total_jobs = len(jobs)

        for job in jobs:
            try:
                # 2. Check for Duplicates in Qdrant (using post_id)
                post_id = job.get("post_id")
                if check_duplicate(post_id):
                    logger.info(f"⏭️ Skipping duplicate: {post_id}")
                    agent_state.duplicates_skipped += 1
                    continue

                # 3. Extract 18 fields using Lyzr Agent
                # We combine titles/descriptions for better extraction
                full_text = f"Role: {job.get('role')}\nCompany: {job.get('company_name')}\nLocation: {job.get('location')}\nContent: {job.get('description')}"
                
                extracted_json = extract_job_data(full_text, keyword=keyword)
                extracted_data = json.loads(extracted_json)

                # 4. MANDATE Original Source URLS (Ground Truth)
                # Scraper URLs are more reliable than AI extraction for links.
                extracted_data["post_id"] = post_id
                extracted_data["post_url"] = job.get("post_url", extracted_data.get("post_url"))
                extracted_data["author_linkedin_url"] = job.get("author_linkedin_url", extracted_data.get("author_linkedin_url"))
                
                if extracted_data.get("location") == "Not specified":
                    extracted_data["location"] = job.get("location", "Remote / Not specified")
                if extracted_data.get("author_name") == "Not specified":
                    extracted_data["author_name"] = job.get("author_name", "Not specified")
                if extracted_data.get("date_posted") == "Not specified":
                    extracted_data["date_posted"] = job.get("date_posted", "Recent")

                logger.info(f"🔗 Preserved Original URL: {extracted_data['post_url']}")

                # 4. Store in Qdrant (Semantic matching ready)
                store_job(extracted_data)

                # 5. Write to Google Sheets (18 columns + timestamp)
                write_to_sheet(extracted_data)

                # 6. Update Frontend State
                agent_state.add_job(extracted_data)
                
                logger.info(f"✅ Job {post_id} processed successfully.")

            except Exception as e:
                logger.error(f"⚠️ Failed to process individual job: {e}")
                continue

    except Exception as e:
        logger.error(f"🛑 Pipeline Critical Error: {e}")
    finally:
        agent_state.stop_running()
        logger.info("🏁 Pipeline execution finished.")

if __name__ == "__main__":
    run_pipeline("Python Intern")