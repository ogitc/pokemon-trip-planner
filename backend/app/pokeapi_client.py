import httpx
from functools import lru_cache
from typing import List, Dict


BASE_URL = "https://pokeapi.co/api/v2"
LOCATION_AREAS_SEARCH_LIMIT = 1000
GENERAL_TIMEOUT = 10.0
POKEAPI_LOCATION_AREAS_SEARCH_LIMIT = 300


@lru_cache(maxsize=256)
def get_location_area_details(location_area_name: str) -> Dict:
    """
    Calls /location-area/{location_area_name} and caches the result.
    """
    url = f"{BASE_URL}/location-area/{location_area_name}"
    resp = httpx.get(url, timeout=GENERAL_TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def search_location_areas(query: str, num_results_limit: int) -> List[dict]:
    """
    Very simple search: fetch first 1000 location-areas and filter by name containing the query.
    """
    url = f"{BASE_URL}/location-area"
    resp = httpx.get(url, params={"limit": LOCATION_AREAS_SEARCH_LIMIT}, timeout=GENERAL_TIMEOUT)
    resp.raise_for_status()
    data = resp.json()

    results = []
    q = query.lower()
    for item in data["results"]:
        if q in item["name"].lower():
            results.append(item)
            if len(results) >= num_results_limit:
                break
    return results


def get_pokemon_encounters_for_area(location_area_name: str) -> List[dict]:
    """
    Returns the raw 'pokemon_encounters' list from the location area.
    """
    data = get_location_area_details(location_area_name)
    return data.get("pokemon_encounters", [])


def get_all_location_areas_for_pokemon(name: str) -> List[dict]:
    """
    Given a pokemon name, find all location areas where it can be encountered.
    NOTE: Not scanning the entire world, added limit to the search.
    """
    url = f"{BASE_URL}/location-area"
    resp = httpx.get(url, params={"limit": POKEAPI_LOCATION_AREAS_SEARCH_LIMIT}, timeout=GENERAL_TIMEOUT * 2)
    resp.raise_for_status()
    results = resp.json()["results"]

    matching_areas = []
    client = httpx.Client(timeout=GENERAL_TIMEOUT)
    url = None
    try:
        for item in results:
            slug = item["name"]
            url = item["url"][:-1]  # The '/' raised an error for some of the urls in the API
            area_data = client.get(url).json()
            for enc in area_data.get("pokemon_encounters", []):
                if enc["pokemon"]["name"] == name:
                    matching_areas.append({"name": slug, "url": url})
                    break
    finally:
        client.close()

    return matching_areas
