from linkedin_fetch import fetch_jobs
from lyzr_agent import extract_job_data
from qdrant_memory import check_duplicate, store_job
from sheets_writer import write_to_sheet


def run_pipeline():

    print("🚀 Starting JobIntel Pipeline...\n")

    jobs = fetch_jobs("python")

    if not jobs:
        print("❌ No jobs fetched")
        return

    for job in jobs:

        print("\nProcessing job...")

        description = job.get("description", "")

        # ✅ LIMIT TEXT SIZE (Fix for Payload Error)
        description = description[:2000]

        if not description:
            continue

        # Check duplicate first
        if check_duplicate(description):

            print("⚠️ Duplicate skipped")
            continue

        # Extract structured data
        extracted = extract_job_data(description)

        # Store memory
        store_job(description)

        # Write to sheet
        write_to_sheet(extracted)

        print("✅ Job processed successfully")


if __name__ == "__main__":
    run_pipeline()