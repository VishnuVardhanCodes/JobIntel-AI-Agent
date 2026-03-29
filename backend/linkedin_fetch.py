import requests


def fetch_jobs(keyword="python"):

    print("Fetching jobs from free API...")

    url = "https://remotive.com/api/remote-jobs"

    params = {
        "search": keyword
    }

    try:

        response = requests.get(url, params=params)

        data = response.json()

        jobs = data["jobs"][:5]  # take first 5 jobs

        print(f"✅ Fetched {len(jobs)} jobs")

        return jobs

    except Exception as e:

        print("❌ Failed to fetch jobs")
        print(e)

        return []


if __name__ == "__main__":

    jobs = fetch_jobs("python")

    print("\nFetched Jobs:\n")

    for job in jobs:

        print({
            "title": job.get("title"),
            "company": job.get("company_name"),
            "location": job.get("candidate_required_location"),
            "description": job.get("description")
        })