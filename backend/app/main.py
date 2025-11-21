from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import init_db
from .routers import trips, locations, pokemon


app = FastAPI(title="Pokemon Trip Planner API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


app.include_router(trips.router, prefix="/trips", tags=["trips"])
app.include_router(locations.router, prefix="/locations", tags=["locations"])
app.include_router(pokemon.router, prefix="/pokemon", tags=["pokemon"])
