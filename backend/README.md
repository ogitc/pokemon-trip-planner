# Backend – Pokémon Trip Planner

Backend service built with **FastAPI**, **SQLModel**, and **SQLite**.

It:

- Stores trips and their location stops
- Talks to **PokéAPI** to fetch encounter data
- Exposes endpoints for:
  - Listing trips
  - Creating a trip
  - Getting trip details
  - Getting Pokémon encounters for a trip
  - Searching location areas (proxy to PokéAPI)
  - Getting extra locations for a given Pokémon (outside the trip)

---

## How to run the backend

### Option A – Local (without Docker)

From the `backend/` folder:

1. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   source .venv/bin/activate        # Windows: .venv\Scripts\activate
    ```

2. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Run the server:

    ```bash
    uvicorn app.main:app --reload
    ```

The backend will be available at API root: http://localhost:8000

Example requests and responses
You can see all endpoints, their schemas, and example requests/responses directly in the Swagger UI at
👉 http://localhost:8000/docs


### Option B – Via Docker

From the `backend/` folder:

    docker build -t pokemon-backend .
    docker run -p 8000:8000 pokemon-backend


The backend will again be available at http://localhost:8000.


## Running backend together with frontend

You can run both backend and frontend together from the project root using Docker Compose.
See the root README.md for detailed instructions (e.g. docker compose up --build).
