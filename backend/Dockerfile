FROM python:3.11-slim

# Set environment variables to optimize Python for containerized execution
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

# Set the working directory to /app
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install Python dependencies efficiently
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the designated port
EXPOSE ${PORT}

# Run the FastAPI server utilizing uvicorn with a single worker for Cloud Run concurrency
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 1
