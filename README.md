# JobIntel AI - Automated LinkedIn Intelligence

**JobIntel AI** is a state-of-the-art AI-powered platform designed to automate LinkedIn job intelligence. It scrapes job listings, analyzes them using advanced AI agents, manages memory via vector databases, and exports processed insights directly to Google Sheets.

## Project Structure

```text
jobintel-agent-brilliant-link-xw4k/
├── backend/            # Python FastAPI Backend
│   ├── main.py         # Entry point
│   ├── config.py       # Configuration & Logging
│   ├── api_routes.py   # API Endpoints
│   ├── ...             # Modular Services
├── frontend/           # Next.js Application (Active)
├── response_schemas/   # JSON Schemas for AI coordination
└── .env                # Environment variables
```

## Features

- **Automated Scraping**: Extract job data from LinkedIn URLs.
- **AI Intelligence**: Extract key insights using **Lyzr-Automata**.
- **Vector Memory**: Identify duplicate jobs and perform semantic search with **Qdrant**.
- **Cloud Storage**: Seamlessly sync data to **Google Sheets**.

## Getting Started

Refer to the `backend/README.md` for backend setup instructions.
