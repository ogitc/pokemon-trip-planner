from datetime import date
from typing import List, Optional

from pydantic import BaseModel


# ---------- Trip & locations ----------

class TripLocationCreate(BaseModel):
    location_area_name: str
    location_area_slug: str
    arrival_date: date
    duration_days: int
    order: int


class TripCreate(BaseModel):
    name: str
    description: Optional[str] = None
    stops: List[TripLocationCreate]


class TripSummary(BaseModel):
    id: int
    name: str
    description: Optional[str]
    start_date: date
    end_date: date
    duration_days: int


class TripStop(BaseModel):
    id: int
    location_area_name: str
    location_area_slug: str
    arrival_date: date
    duration_days: int
    order: int


class TripDetails(BaseModel):
    id: int
    name: str
    description: Optional[str]
    start_date: date
    end_date: date
    stops: List[TripStop]


# ---------- Pokemon encounters ----------

class PokemonEncounter(BaseModel):
    name: str
    max_chance: float
    locations_in_trip: List[str]
    encounter_methods: List[str]
    encounter_conditions: List[str]


class PokemonExtraLocation(BaseModel):
    location_area_name: str
    location_area_url: str


# ---------- PokeAPI Schemas ----------

class NamedAPIResource(BaseModel):
    """
    A simple object that contains the name and URL for a resource.
    """
    name: str
    url: str

class Encounter(BaseModel):
    min_level: int
    max_level: int
    condition_values: List[NamedAPIResource]
    chance: int
    method: NamedAPIResource

class VersionEncounterDetail(BaseModel):
    max_chance: int
    version: NamedAPIResource
    encounter_details: List[Encounter]

class PokeAPIPokemonEncounter(BaseModel):
    pokemon: NamedAPIResource
    version_details: List[VersionEncounterDetail]