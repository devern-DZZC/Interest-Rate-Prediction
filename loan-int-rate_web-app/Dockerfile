# Stage 1: Build React frontend
FROM node:20 AS frontend-build

WORKDIR /frontend
COPY frontend/ ./
RUN npm install
RUN npm run build  # assuming build output is in frontend/dist or frontend/build

# Stage 2: Build backend + serve frontend
FROM python:3.12-slim

WORKDIR /app

# Install system deps (if needed)
RUN apt-get update && apt-get install -y gcc build-essential && apt-get clean

# Install Python dependencies
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code

COPY app/ ./app
COPY app/model/ ./model/

# Copy React build into Flask static folder (adjust path as per your Flask static folder)
COPY --from=frontend-build /frontend/dist ./app/static

# Expose Flask port
EXPOSE 8001

# Run Flask app (adjust if you use different entrypoint)
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8001", "--timeout", "120", "app.wsgi:app"]
