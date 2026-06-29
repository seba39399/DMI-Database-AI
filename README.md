# 🏥 Club Noel - Medical Device Ingestion & Registry (DMI)

This project is a registry system and digital mirror for the validation of medical implant technical cards at the Club Noel children's clinic, integrated with an AI-assisted heuristic risk classification engine.

---

## 🛠️ Key Technologies

- **Backend:** FastAPI (Python 3.12), SQLite, Pytest, Ruff (Linter/Formatter).
- **Frontend:** React (Vite), Tailwind CSS, Vitest, React Testing Library.
- **Containerization:** Docker (Multi-stage builds with Nginx for the frontend and Astral UV for the backend).

---

## 🚀 Quick Start (Local)

Ensure you have a Python virtual environment installed in `.venv` and Node packages ready.

### Option A: Windows (PowerShell)

Use the native automated script:

```powershell
# 1. Install all dependencies (Backend + Frontend)
.\run.ps1 install

# 2. Seed the database with mock data
.\run.ps1 seed

# 3. Spin up the Backend (FastAPI at http://localhost:8000)
.\run.ps1 run-back

# 4. Spin up the Frontend (Vite at http://localhost:5173)
.\run.ps1 run-front
```

### Option B: Linux / macOS / Git Bash

Use the centralized `Makefile`:

```bash
make install
make seed
make run-back
make run-front
```

---

## 🐳 Docker Deployment

Both services are fully containerized for production.

### 1. Launch Backend

```bash
cd backend
docker build -t clubnoel-backend .
docker run -d -p 8000:8000 --name backend-container clubnoel-backend
```

### 2. Launch Frontend (Served by Nginx)

```bash
cd frontend
docker build -t clubnoel-frontend .
docker run -d -p 80:80 --name frontend-container clubnoel-frontend
```

---

## 🧪 Running Tests

The system features a complete suite of **32 automated tests** (16 backend and 16 frontend).

### Backend Tests (Pytest)

```powershell
# Using PowerShell:
.\run.ps1 test-back
```

```bash
# Or using Makefile:
make test-back
```

### Frontend Tests (Vitest)

```powershell
# Using PowerShell:
.\run.ps1 test-front
```

```bash
# Or using Makefile:
make test-front
```

---

## 🧹 Code Quality (Ruff)

To keep the backend clean and formatted under PEP-8 standards:

```powershell
.\run.ps1 format
.\run.ps1 lint
```
