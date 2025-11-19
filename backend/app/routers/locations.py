from typing import List
from fastapi import APIRouter, Query

from .. import pokeapi_client


router = APIRouter()
DEFAULT_NUM_RESULTS_LIMIT = 10


@router.get("/search")
def search_locations(q: str = Query(..., min_length=1), num_results_limit: int = DEFAULT_NUM_RESULTS_LIMIT) -> List[dict]:
    """
    Simple proxy for PokéAPI location-area search.
    Returns list of { name, url } items that match the query.
    """
    results = pokeapi_client.search_location_areas(q, num_results_limit)
    return [
        {
            "name": item["name"],
            "slug": item["name"],
            "url": item["url"],
        }
        for item in results
    ]
