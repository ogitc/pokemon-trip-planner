import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import {
  fetchTrip,
  fetchTripPokemon,
  fetchPokemonExtraLocations,
} from "../api/client";
import {
  type TripDetails,
  type PokemonEncounter,
  type PokemonExtraLocation,
} from "../types";
import PokemonTable from "../components/PokemonTable";
import PokemonModal from "../components/PokemonModal";

function formatDate(dateStr: string) {
  return format(new Date(dateStr), "dd/MM/yyyy");
}

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [pokemon, setPokemon] = useState<PokemonEncounter[]>([]);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [loadingPokemon, setLoadingPokemon] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalPokemonName, setModalPokemonName] = useState<string | null>(null);
  const [modalLocations, setModalLocations] = useState<
    PokemonExtraLocation[] | null
  >(null);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoadingTrip(true);
        const t = await fetchTrip(id);
        setTrip(t);
      } catch (err) {
        console.error(err);
        setError("Failed to load trip");
      } finally {
        setLoadingTrip(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoadingPokemon(true);
        const p = await fetchTripPokemon(id);
        setPokemon(p);
      } catch (err) {
        console.error(err);
        // not fatal: just keep table empty
      } finally {
        setLoadingPokemon(false);
      }
    })();
  }, [id]);

  async function handleClickPokemonName(name: string) {
    if (!trip) return;
    setModalPokemonName(name);
    setModalLocations(null);
    setLoadingModal(true);
    try {
      const locs = await fetchPokemonExtraLocations(name, trip.id);
      setModalLocations(locs);
    } catch (err) {
      console.error(err);
      setModalLocations([]);
    } finally {
      setLoadingModal(false);
    }
  }

  function closeModal() {
    setModalPokemonName(null);
    setModalLocations(null);
  }

  if (loadingTrip) return <p>Loading trip...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!trip) return <p>Trip not found.</p>;

  return (
    <div>
      <h2>{trip.name}</h2>
      {trip.description && <p>{trip.description}</p>}
      <p>
        {formatDate(trip.start_date)} – {formatDate(trip.end_date)} (
        {trip.stops.length > 0
          ? // compute duration on UI as well if needed:
            `${Math.round(
              (new Date(trip.end_date).getTime() -
                new Date(trip.start_date).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1} days`
          : "No stops"}
        )
      </p>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Stops</h3>
        {trip.stops.length === 0 ? (
          <p>No stops yet.</p>
        ) : (
          <ul>
            {trip.stops
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((stop) => (
                <li key={stop.id}>
                  #{stop.order} – {stop.location_area_name} (
                  {formatDate(stop.arrival_date)}, {stop.duration_days} day
                  {stop.duration_days > 1 ? "s" : ""})
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Pokémon encounters</h3>
        {loadingPokemon ? (
          <p>Loading Pokémon data…</p>
        ) : (
          <PokemonTable
            pokemon={pokemon}
            onClickName={handleClickPokemonName}
          />
        )}
      </div>

      {modalPokemonName && (
        <PokemonModal
          pokemonName={modalPokemonName}
          extraLocations={
            loadingModal ? null : modalLocations ?? []
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
}
