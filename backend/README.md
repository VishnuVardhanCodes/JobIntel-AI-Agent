# JobIntel AI Backend

Modular Python backend for JobIntel AI. Powered by FastAPI, Lyzr-Automata, Qdrant, and Google Sheets API.

## Project Structure

- `main.py`: FastAPI entry point.
- `config.py`: Centralized logging and configuration management.
- `linkedin_scraper.py`: Logic for LinkedIn job extraction.
- `lyzr_agent.py`: Lyzr-Automata SDK integration.
- `qdrant_memory.py`: Vector search and duplicate detection with Qdrant.
- `sheets_writer.py`: Writing processed data to Google Sheets.
- `api_routes.py`: API endpoint definitions.

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup Environment Variables:
   Copy `.env` template and add your API keys:
   - `OPENAI_API_KEY`
   - `LYZR_API_KEY`
   - `QDRANT_API_KEY`
   - `GOOGLE_SHEET_ID`

## Running the Server

Start the FastAPI application using `uvicorn`:
```bash
uvicorn main:app --reload
```

The API will be accessible at `http://localhost:8000`.
Documentation is available at `http://localhost:8000/docs`.
