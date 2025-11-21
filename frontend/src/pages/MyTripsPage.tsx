import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTrips } from "../api/client";
import type { TripSummary } from "../types";
import { format } from "date-fns";

function formatDate(dateStr: string) {
  return format(new Date(dateStr), "dd/MM/yyyy");
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load trips");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>My Trips</h2>
      {trips.length === 0 && <p>No trips yet. Try creating one!</p>}

      {trips.map((trip) => (
        <div className="card" key={trip.id}>
          <h3>
            <Link to={`/trips/${trip.id}`}>{trip.name}</Link>
          </h3>
          {trip.description && <p>{trip.description}</p>}
          <p>
            {formatDate(trip.start_date)} – {formatDate(trip.end_date)} (
            {trip.duration_days} days)
          </p>
          <Link to={`/trips/${trip.id}`}>View details →</Link>
        </div>
      ))}
    </div>
  );
}
