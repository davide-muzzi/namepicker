# Namepicker

A Dockerized full-stack web application to randomly pick students from classes.

Built as a clean DevOps-style setup with separate frontend and backend services,
containerized via Docker and orchestrated using Docker Compose.

## Tech Stack

### Frontend

- Vue 3
- Vite
- Nginx (production build + reverse proxy)

### Backend

- Node.js
- Express
- SQLite (persistent via Docker volume)

### DevOps

- Docker & Docker Compose
- GitHub Actions
- GitHub Container Registry (GHCR)

## Architecture Overview

Browser  
↓  
Frontend (Vue + Nginx)  :8324  
↓  /api/*  
Backend (Node + Express) :3000  
↓  
SQLite DB (Docker volume)

- The frontend does not talk directly to the backend via localhost.
- All API requests are proxied through Nginx using `/api/*`.
- The backend service is internal only (not exposed to the host).
- SQLite data persists using a Docker volume.

## Run Locally

### Requirements

- Docker
- Docker Compose

### Start the app

```bash
docker compose up --build
```

### Access

- Frontend: http://localhost:8324
- API (via frontend proxy): http://localhost:8324/api

## API Documentation

All API endpoints are available under `/api/*`.

### Classes

#### Get all classes

GET /api/classes

#### Create a class

POST /api/classes  
Content-Type: application/json

{
  "name": "Class A"
}

#### Update a class

PUT /api/classes/:id  
Content-Type: application/json

{
  "name": "Updated Class Name"
}

#### Delete a class

DELETE /api/classes/:id

### Students

#### Get students of a class

GET /api/students/class/:classId

#### Create a student

POST /api/students  
Content-Type: application/json

{
  "name": "Max Mustermann",
  "class_id": 1
}

#### Update a student

PUT /api/students/:id  
Content-Type: application/json

{
  "name": "Updated Name"
}

#### Delete a student

DELETE /api/students/:id

### Random Pick

#### Pick random student(s) from a class

POST /api/pick  
Content-Type: application/json

{
  "class_id": 1,
  "count": 1
}

Response:
[
  {
    "id": 3,
    "name": "Max Mustermann"
  }
]

## Persistence

- SQLite database is stored inside `/app/data/db.sqlite`
- This path is mounted to a Docker volume
- Data survives container restarts

## Docker & CI

- Each service has its own Dockerfile
- Images are built and pushed automatically via GitHub Actions
- Images are published to GitHub Container Registry (GHCR)
- Docker Compose works both locally and with published images

## Notes

- Backend is intentionally not exposed to the host
- Frontend Nginx acts as a reverse proxy for the API
- This setup follows real-world containerized full-stack best practices
