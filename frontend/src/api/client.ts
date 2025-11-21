import axios from "axios";
import {
  type TripSummary,
  type TripDetails,
  type TripCreate,
  type LocationSearchResult,
  type PokemonEncounter,
  type PokemonExtraLocation,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// -------- Trips --------

export async function fetchTrips(): Promise<TripSummary[]> {
  const res = await api.get<TripSummary[]>("/trips");
  return res.data;
}

export async function createTrip(payload: TripCreate): Promise<TripDetails> {
  const res = await api.post<TripDetails>("/trips", payload);
  return res.data;
}

export async function fetchTrip(tripId: string | number): Promise<TripDetails> {
  const res = await api.get<TripDetails>(`/trips/${tripId}`);
  return res.data;
}

export async function fetchTripPokemon(
  tripId: string | number
): Promise<PokemonEncounter[]> {
  const res = await api.get<PokemonEncounter[]>(`/trips/${tripId}/pokemon`);
  return res.data;
}

// -------- Locations --------

export async function searchLocations(
  query: string
): Promise<LocationSearchResult[]> {
  const res = await api.get<LocationSearchResult[]>("/locations/search", {
    params: { q: query, limit: 10 },
  });
  return res.data;
}

// -------- Pokemon --------

export async function fetchPokemonExtraLocations(
  pokemonName: string,
  tripId: number
): Promise<PokemonExtraLocation[]> {
  const res = await api.get<PokemonExtraLocation[]>(
    `/pokemon/${pokemonName}/extra-locations`,
    { params: { trip_id: tripId } }
  );
  return res.data;
}
