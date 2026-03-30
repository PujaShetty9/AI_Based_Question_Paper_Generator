# AI-Based Question Paper Generator

Flask backend + Vite/React frontend + ML notebooks.
Generates question papers from syllabus using Bloom's taxonomy.

## Stack
- Backend: Python, Flask, Firebase/SQLite (db.py)
- Frontend: Vite + React, Tailwind CSS
- Notebooks: Jupyter (ML experiments)
- CI/CD: GitHub Actions (.github/workflows/)

## Key Directories
- `backend/generators/` — core question generation logic
- `backend/utils/` — helper functions
- `frontend/src/` — React components
- `notebooks/` — ML experiments, do not modify from backend

## Commands
- `cd backend && python app.py` — run Flask dev server
- `cd frontend && npm run dev` — run Vite dev server
- `pip install -r backend/requirements.txt` — install backend deps

## Rules
- Backend: follow PEP8, type hints on all functions
- Frontend: functional components only, no class components
- NEVER commit .env files
- Notebooks are for exploration only — production logic goes in backend/
- Docker: frontend Dockerfile in /frontend, backend in /backend,
  docker-compose.yml at root

<!-- how to actually use it:

install Claude Code → npm install -g @anthropic-ai/claude-code
cd into your project root
run claude in terminal
the fastest way to start is the /init command — run it in your project directory and Claude generates a starter CLAUDE.md based on your project structure and detected tech stack. Builder.io then just trim what you don't need
commit the .claude/ folder to your repo so your friend's setup also benefits   -->