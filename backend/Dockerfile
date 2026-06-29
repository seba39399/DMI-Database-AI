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
COPY pyproject.toml uv.lock ./

# Install dependencies directly into the Docker system environment quickly
RUN uv pip install --system -r pyproject.toml

# Copy the rest of the backend codebase into the container
COPY . .

# Expose the port FastAPI will listen on
EXPOSE 8000

# Define the health check to validate that the container is responding correctly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/implant-cards || exit 1

# Default command to start the production server with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]