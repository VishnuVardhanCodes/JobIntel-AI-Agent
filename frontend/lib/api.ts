export interface JobData {
  role: string;
  company_name: string;
  location: string;
  primary_skills: string[] | string;
  years_of_experience: string;
  email: string;
}

export interface AgentStatus {
  status: string;
  last_run_time: string;
  jobs_processed: number;
  memory_status: string;
  total_jobs: number;
  unique_jobs: number;
  duplicates_skipped: number;
}

export const MOCK_JOBS: JobData[] = [
  {
    role: "Senior AI Engineer",
    company_name: "TechCorp",
    location: "San Francisco, CA (Remote)",
    primary_skills: ["Python", "PyTorch", "LLMs"],
    years_of_experience: "5+ years",
    email: "recruiter@techcorp.com",
  },
  {
    role: "ML Platform Engineer",
    company_name: "DataScale Inc",
    location: "New York, NY",
    primary_skills: ["Kubernetes", "Python", "MLOps"],
    years_of_experience: "3-5 years",
    email: "hr@datascale.io",
  },
  {
    role: "AI Research Intern",
    company_name: "DeepMind Lab",
    location: "London, UK",
    primary_skills: ["Python", "Research", "NLP"],
    years_of_experience: "Entry Level",
    email: "internships@deepmind.com",
  },
  {
    role: "Frontend Developer (React)",
    company_name: "Creative Labs",
    location: "Austin, TX",
    primary_skills: ["Next.js", "Tailwind", "TypeScript"],
    years_of_experience: "2+ years",
    email: "jobs@creativelabs.io",
  },
  {
    role: "Full Stack Developer",
    company_name: "FinTech Solutions",
    location: "Chicago, IL",
    primary_skills: ["Node.js", "React", "PostgreSQL"],
    years_of_experience: "4+ years",
    email: "careers@fintech.com",
  }
];

export const MOCK_STATUS: AgentStatus = {
  status: "Online",
  last_run_time: "2026-03-29 14:30:00",
  jobs_processed: 125,
  memory_status: "Healthy",
  total_jobs: 150,
  unique_jobs: 125,
  duplicates_skipped: 25,
};

const BASE_URL = "http://localhost:8000";

export const getJobs = async (useDemo: boolean = false): Promise<JobData[]> => {
  if (useDemo) return MOCK_JOBS;
  try {
    const res = await fetch(`${BASE_URL}/jobs`);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getStatus = async (useDemo: boolean = false): Promise<AgentStatus> => {
  if (useDemo) return MOCK_STATUS;
  try {
    const res = await fetch(`${BASE_URL}/status`);
    if (!res.ok) throw new Error("Failed to fetch status");
    return await res.json();
  } catch (error) {
    console.error(error);
    return MOCK_STATUS; // Fallback to mock if API down
  }
};

export const runAgent = async (keyword: string): Promise<{ message: string; keyword: string }> => {
  const res = await fetch(`${BASE_URL}/run-agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword }),
  });
  if (!res.ok) throw new Error("Agent Failed — Try Again");
  return await res.json();
};
