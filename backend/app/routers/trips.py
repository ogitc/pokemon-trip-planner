from datetime import timedelta
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from .. import models, schemas, pokeapi_client


router = APIRouter()


def build_trip_details(trip: models.Trip, session: Session) -> schemas.TripDetails:
    """
    Builds a trip details object for a given trip ID.
    """
    locations = session.exec(
        select(models.TripLocation).where(models.TripLocation.trip_id == trip.id)
    ).all()

    stops = [
        schemas.TripStop(
            id=location.id,
            location_area_name=location.location_area_name,
            location_area_slug=location.location_area_slug,
            arrival_date=location.arrival_date,
            duration_days=location.duration_days,
            order=location.order,
        )
        # sort locations by order for frontend display
        for location in sorted(locations, key=lambda location: location.order)  
    ]

    return schemas.TripDetails(
        id=trip.id,
        name=trip.name,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        stops=stops,
    )


@router.get("/", response_model=List[schemas.TripSummary])
def list_trips(session: Session = Depends(get_session)):
    """
    Returns a list of all trips.
    """
    trips = session.exec(select(models.Trip)).all()
    summaries: List[schemas.TripSummary] = []

    for trip in trips:
        duration = (trip.end_date - trip.start_date).days + 1
        summaries.append(
            schemas.TripSummary(
                id=trip.id,
                name=trip.name,
                description=trip.description,
                start_date=trip.start_date,
                end_date=trip.end_date,
                duration_days=duration,
            )
        )
    return summaries


@router.post("/", response_model=schemas.TripDetails)
def create_trip(trip_in: schemas.TripCreate, session: Session = Depends(get_session)):
    """
    Creates a new trip.
    """
    if not trip_in.stops:
        raise HTTPException(status_code=400, detail="Trip must have at least one stop")  # return 400 Bad Request

    start_date = min(stop.arrival_date for stop in trip_in.stops)
    end_date = max(
        s.arrival_date + timedelta(days=s.duration_days - 1)
        for s in trip_in.stops
    )

    trip = models.Trip(
        name=trip_in.name,
        description=trip_in.description,
        start_date=start_date,
        end_date=end_date,
    )
    session.add(trip)
    session.flush()

    for stop in trip_in.stops:
        location = models.TripLocation(
            trip_id=trip.id,
            location_area_name=stop.location_area_name,
            location_area_slug=stop.location_area_slug,
            arrival_date=stop.arrival_date,
            duration_days=stop.duration_days,
            order=stop.order,
        )
        session.add(location)

    session.commit()
    session.refresh(trip)

    return build_trip_details(trip, session)


@router.get("/{trip_id}", response_model=schemas.TripDetails)
def get_trip(trip_id: int, session: Session = Depends(get_session)):
    """
    Returns a trip details object for a given trip ID.
    """
    trip = session.get(models.Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    return build_trip_details(trip, session)



@router.get("/{trip_id}/pokemon", response_model=List[schemas.PokemonEncounter])
def get_trip_pokemon(trip_id: int, session: Session = Depends(get_session)):
    """
    Returns a list of pokemon encounters for a given trip ID.
    """
    trip = session.get(models.Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    locations = session.exec(
        select(models.TripLocation).where(models.TripLocation.trip_id == trip.id)
    ).all()
    if not locations:
        return []

    # aggregate pokemon encounters by pokemon name
    aggregated_encounters: Dict[str, Dict] = {}
    for location in locations:
        encounters: List[schemas.PokeAPIPokemonEncounter] = pokeapi_client.get_pokemon_encounters_for_area(
            location.location_area_name
        )
        for encounter in encounters:
            name = encounter["pokemon"]["name"]
            best_chance = 0.0
            methods = set()
            conditions = set()

            for version_detail in encounter.get("version_details", []):
                for encounter_detail in version_detail.get("encounter_details", []):
                    chance = encounter_detail.get("chance", 0)
                    if chance > best_chance:
                        best_chance = chance
                    method_name = encounter_detail["method"]["name"]
                    methods.add(method_name)
                    for condition_value in encounter_detail.get("condition_values", []):
                        conditions.add(condition_value["name"])

            if name not in aggregated_encounters:
                aggregated_encounters[name] = {
                    "max_chance": best_chance,
                    "locations": {location.location_area_name},
                    "methods": set(methods),
                    "conditions": set(conditions),
                }
            else:
                aggregated_encounters[name]["max_chance"] = max(aggregated_encounters[name]["max_chance"], best_chance)
                aggregated_encounters[name]["locations"].add(location.location_area_name)
                aggregated_encounters[name]["methods"].update(methods)
                aggregated_encounters[name]["conditions"].update(conditions)

    # Convert to schema objects
    result: List[schemas.PokemonEncounter] = []
    for name, data in aggregated_encounters.items():
        result.append(
            schemas.PokemonEncounter(
                name=name,
                max_chance=data["max_chance"],
                locations_in_trip=sorted(data["locations"]),
                encounter_methods=sorted(data["methods"]),
                encounter_conditions=sorted(data["conditions"]),
            )
        )

    result.sort(key=lambda p: p.max_chance, reverse=True)
    return result
