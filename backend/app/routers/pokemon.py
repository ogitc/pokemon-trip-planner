from typing import List, Set
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from ..db import get_session
from .. import models, schemas
from .. import pokeapi_client


router = APIRouter()


@router.get("/{pokemon_name}/extra-locations", response_model=List[schemas.PokemonExtraLocation])
def get_extra_locations_for_pokemon(
    pokemon_name: str,
    trip_id: int = Query(...),
    session: Session = Depends(get_session),
):
    """
    For a given pokemon and trip, returns suggested other locations
    that are **not** part of this trip.
    """
    trip = session.get(models.Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    locations = session.exec(
        select(models.TripLocation).where(models.TripLocation.trip_id == trip.id)
    ).all()
    trip_slugs: Set[str] = {loc.location_area_slug for loc in locations}


    all_areas = pokeapi_client.get_all_location_areas_for_pokemon(pokemon_name)

    extra_areas = []
    for area in all_areas:
        slug = area["name"]
        if slug not in trip_slugs:
            extra_areas.append(
                schemas.PokemonExtraLocation(
                    location_area_name=slug,
                    location_area_url=area["url"],
                )
            )

    return extra_areas
