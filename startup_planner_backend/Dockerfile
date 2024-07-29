# Use the official Python image from the Docker Hub
FROM python:3.12-slim

ARG OPENAI_API_KEY

# Set the OPENAI key environment variable
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create and set the working directory
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
  build-essential \
  libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip && \
  pip install -r requirements.txt

# Copy project files to the working directory
COPY . .

# Run migrations and collect static files
RUN python manage.py makemigrations && \
  python manage.py migrate && \
  mkdir -p /usr/src/app/staticfiles && \
  python manage.py collectstatic --noinput

# Expose port 8000 for the application
EXPOSE 8000

# Run the application
CMD ["gunicorn", "startup_planner_backend.wsgi:application", "--bind", "0.0.0.0:$PORT", "--timeout", "120", "--workers", "3"]

