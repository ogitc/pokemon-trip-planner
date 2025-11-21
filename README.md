# Pokémon Trip Planner

A small full-stack app for planning Pokémon trips:

- **Backend**: FastAPI + SQLModel + SQLite, talks to PokéAPI
- **Frontend**: React + TypeScript + Vite, shows trips and Pokémon encounters

This repo is structured as:

- `backend/` – FastAPI service
- `frontend/` – React app
- `docker-compose.yml` – runs everything together

---

## Running everything with Docker Compose

### Prerequisites

- Docker
- Docker Compose (or `docker compose` plugin)

### Run

From the repo root:

```bash
docker compose up --build
