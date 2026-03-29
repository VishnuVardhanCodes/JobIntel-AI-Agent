# JobIntel AI — LinkedIn Job Intelligence Agent

Automated job extraction and analysis pipeline using Lyzr, Qdrant, and Groq.

## 📁 Project Structure

```text
jobintel-agent-brilliant-link-xw4k/
├── frontend/           # Premium Next.js (React) Dashboard
├── backend/            # FastAPI Python server & Agent logic
└── venv311/            # Python Virtual Environment
```

## 🚀 Getting Started

To run the full application, you need to start both the backend and frontend.

### 1. Backend Setup (AI & Engine)

```bash
cd backend
# Activate virtual environment
# Windows: ..\venv311\Scripts\activate
# Install deps
pip install -r requirements.txt
# Run the FastAPI server
python main.py
```

*Note: Ensure `backend/service_account.json` exists for Google Sheets integration.*

### 2. Frontend Setup (Dashboard)

```bash
cd frontend
# Install deps
npm install
# Run the development server
npm run dev
```

The dashboard will be available at `http://localhost:3333` (as configured in `package.json`).

## 🌟 Key Features

- **Lyzr Orchestration**: Advanced agent logic for job analysis.
- **Qdrant Memory**: Efficient duplicate detection.
- **Premium Dashboard**: Glassmorphism UI with real-time status.
- **Demo Mode**: Built-in mock data for easy presentation.

Built with **Lyzr + Qdrant + Groq AI**.
