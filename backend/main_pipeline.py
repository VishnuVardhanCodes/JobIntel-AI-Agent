import json
from linkedin_fetch import fetch_jobs
from lyzr_agent import extract_job_data
from qdrant_memory import check_duplicate, store_job
from sheets_writer import write_to_sheet
from state import agent_state


def run_pipeline(keyword: str = "python"):

    agent_state.start_running()
    print(f"🚀 Starting JobIntel Pipeline for: {keyword}...\n")

    try:
        jobs = fetch_jobs(keyword)

        if not jobs:
            print(f"❌ No jobs fetched for {keyword}")
            agent_state.stop_running()
            return

        agent_state.total_jobs = len(jobs)

        for job in jobs:

            print("\nProcessing job...")

            description = job.get("description", "")

            # ✅ LIMIT TEXT SIZE (Fix for Payload Error)
            description = description[:2000]

            if not description:
                continue

            # Check duplicate first (DISABLED FOR DEMO to show results every time)
            # if check_duplicate(description):
            #     print("⚠️ Duplicate skipped")
            #     agent_state.duplicates_skipped += 1
            #     continue

            # Extract structured data
            extracted = extract_job_data(description)

            # Store memory
            store_job(description)

            # Write to sheet
            write_to_sheet(extracted)

            # Update State with Harmonized Keys for Frontend
            try:
                data = json.loads(extracted)
                harmonized = {
                    "role": data.get("Role", "N/A"),
                    "company_name": data.get("Company Name", "N/A"),
                    "location": data.get("Location", "N/A"),
                    "primary_skills": data.get("Primary Skills", "N/A"),
                    "years_of_experience": data.get("Years of Experience", "N/A"),
                    "email": data.get("Email", "N/A")
                }
                agent_state.add_job(harmonized)
            except Exception as e:
                print(f"⚠️ Failed to parse extracted data for state: {e}")

            print("✅ Job processed successfully")

    finally:
        agent_state.stop_running()
        print("🏁 Pipeline execution finished.")


if __name__ == "__main__":
    run_pipeline()