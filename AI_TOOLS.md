# AI Tools Usage

This document explains how I used AI tools (specifically ChatGPT) while working on this project.

## Tool

- **ChatGPT (OpenAI)** – model: **GPT-5.1 Thinking**

## What I used ChatGPT for

### 1. Planning and architecture

- Brainstormed the overall architecture:
  - Split into `backend/` (FastAPI) and `frontend/` (React + Vite)
  - Basic routing and responsibility division between backend and frontend
- Discussed data modeling decisions, for example:
  - Storing **trips** and **trip locations** in the local DB
  - Fetching Pokémon encounter data on demand from **PokéAPI**, instead of persisting it

### 2. Backend scaffolding

- Drafted initial versions of:
  - **FastAPI app structure** (`main.py`, `routers/`, `db.py`)
  - **SQLModel models** (`Trip`, `TripLocation`)
  - **Pydantic schemas** (`TripCreate`, `TripSummary`, `TripDetails`, etc.)
  - **PokéAPI client** helper functions
  - Route handlers for:
    - `GET /trips`
    - `POST /trips`
    - `GET /trips/{id}`
    - `GET /trips/{id}/pokemon`
    - `GET /locations/search`
    - `GET /pokemon/{name}/extra-locations`

- Used ChatGPT to help debug a relationship/ORM issue and then simplified the models by removing unnecessary ORM relationships.

### 3. Frontend scaffolding

- Generated initial versions of:
  - A typed **API client** using Axios (`src/api/client.ts`)
  - Shared **TypeScript types** mirroring backend schemas (`src/types.ts`)
  - Page components:
    - `MyTripsPage` (list trips)
    - `CreateTripPage` (create and submit trips)
    - `TripDetailsPage` (show trip details and Pokémon encounters)
  - UI components:
    - `LocationSearchInput` (autocomplete via backend search endpoint)
    - `PokemonTable` (sortable table)
    - `PokemonModal` (lists extra suggested locations)

- Asked ChatGPT for simple CSS to keep the app centered and readable (container layout, basic cards, etc.).

### 4. DevOps / DX polish

- Used ChatGPT to scaffold:
  - `Dockerfile` for backend (FastAPI + Uvicorn)
  - `Dockerfile` for frontend (Vite build + Nginx)
  - `docker-compose.yml` wiring backend and frontend
  - Initial versions of `README.md` files for root, backend, and frontend

These were then edited and adjusted to reflect the actual command lines, ports, and environment variables used in the final project.

---

## What I did manually

Even though ChatGPT helped generate a lot of boilerplate, I:

- Verified and adjusted all models, schemas, and routes to match the assignment requirements.
- Adapted and simplified the SQLModel usage to avoid relationship mapping issues.
- Wired the frontend pages to the real backend endpoints and fixed runtime errors.
- Verified flows end-to-end:
  - Creating a trip from the UI
  - Listing trips
  - Viewing trip details
  - Loading and sorting Pokémon encounter data
  - Opening the modal with extra suggested locations
- Cleaned up and organized the final README files and configuration (e.g. Docker Compose and environment variables).

---

## Why I used AI tools

- To speed up repetitive boilerplate (e.g. standard FastAPI/React setup).
- To reduce time spent on “remembering exact syntax” and focus on:
  - Data modeling
  - Endpoint behavior
  - Overall UX
- To get quick suggestions for layout and documentation structure.

All AI-generated outputs were treated as **drafts**, then reviewed, tested, and refined before being included in the final project.