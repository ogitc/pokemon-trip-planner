# Frontend – Pokémon Trip Planner

Frontend application built with:

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **Axios**

It communicates with the FastAPI backend and provides:

- **My Trips** page – list all trips with:
  - name, description, date span, duration
- **Create Trip** page – create a new trip:
  - search location areas (via backend → PokéAPI)
  - select multiple locations
  - set arrival date and duration per location
- **Trip Details** page – view:
  - trip information and stops
  - a sortable Pokémon encounters table
  - a modal with extra suggested locations for a selected Pokémon

---

## How to run the frontend

### Option A – Local (without Docker)

From the `frontend/` folder:

1. Install dependencies:

   ```bash
   npm install
    ```

2. (Optional) configure API base URL:

    
    By default, the frontend uses:
   ```bash
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    ```

    To override, edit the `.env` file in `frontend/`

3. Run the dev server:

    ```bash
    npm run dev
    ```


### Option B – Via Docker

From the `frontend/` folder:

    docker build -t pokemon-frontend .
    docker run -p 5173:80 pokemon-frontend

By default the Dockerfile builds with:

  
    ARG VITE_API_BASE_URL=http://localhost:8000

You can override it at build time, for example:

      docker build \
        -t pokemon-frontend \
        --build-arg VITE_API_BASE_URL=http://localhost:8000 \
        .

The frontend will again be available at http://localhost:5173.


## Running backend together with frontend

You can run both backend and frontend together from the project root using Docker Compose.
See the root README.md for detailed instructions (e.g. docker compose up --build).
