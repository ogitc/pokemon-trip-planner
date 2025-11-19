from datetime import date, datetime
from typing import Optional

from sqlmodel import SQLModel, Field


class Trip(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TripLocation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    trip_id: int = Field(foreign_key="trip.id")

    location_area_name: str
    location_area_slug: str
    arrival_date: date
    duration_days: int
    order: int
