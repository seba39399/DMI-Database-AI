# Makefile for the DMI Project development - Clínica Infantil Club Noel (Root)

.PHONY: run-backend run-frontend help

# Default command when running just 'make'
help:
	@echo "Available commands from root:"
	@echo "  make run-backend  - Move to backend directory and start FastAPI"
	@echo "  make run-frontend - Move to frontend directory and start React + Vite"

# Start the Backend (FastAPI)
run-backend:
	@echo "🚀 Starting Backend (FastAPI)..."
	cd backend && uvicorn main:app --reload

# Start the Frontend (React + Vite)
run-frontend:
	@echo "💻 Starting Frontend (React + Vite)..."
	cd frontend && npm run dev