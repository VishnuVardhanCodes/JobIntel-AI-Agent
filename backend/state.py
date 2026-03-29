import time

class AgentState:
    def __init__(self):
        self.status = "Online"
        self.last_run_time = "Never"
        self.jobs_processed = 0
        self.memory_status = "Healthy"
        self.total_jobs = 0
        self.unique_jobs = 0
        self.duplicates_skipped = 0
        self.jobs = []

    def start_running(self):
        self.status = "Running"
        self.last_run_time = time.strftime("%Y-%m-%d %H:%M:%S")
        self.jobs = [] # Clear previous run jobs if needed
        self.total_jobs = 0
        self.unique_jobs = 0
        self.duplicates_skipped = 0
        self.jobs_processed = 0

    def stop_running(self):
        self.status = "Online"

    def add_job(self, job_data):
        self.jobs.insert(0, job_data) # Newest first
        self.unique_jobs += 1
        self.jobs_processed += 1

    def get_dict(self):
        return {
            "status": self.status,
            "last_run_time": self.last_run_time,
            "jobs_processed": self.jobs_processed,
            "memory_status": self.memory_status,
            "total_jobs": self.total_jobs,
            "unique_jobs": self.unique_jobs,
            "duplicates_skipped": self.duplicates_skipped
        }

agent_state = AgentState()
