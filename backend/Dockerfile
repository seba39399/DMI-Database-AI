# ==============================================================================
# 1. COMPILATION AND BASE CONFIGURATION STAGE
# ==============================================================================
FROM python:3.12-slim

# Define environment variables to optimize Python inside Docker
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies needed for network health checks (curl) and SQLite
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy the 'uv' tool from its official image for ultra-fast installation
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency files to leverage Docker layer caching
COPY pyproject.toml uv.lock* ./

# Install dependencies directly into the Docker system environment quickly
RUN uv pip install --system -r pyproject.toml

# Copy the entire backend folder contents into /app
COPY backend/ .

# Expose the port FastAPI will listen on
EXPOSE 8000

# Health check using the lightweight /health endpoint we verified in main.py
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default command to start the production server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]