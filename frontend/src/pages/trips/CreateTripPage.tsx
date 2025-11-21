import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LocationSearchInput from "../../components/LocationSearchInput";
import { createTrip } from "../../api/client";
import { type LocationSearchResult, type TripLocationCreate } from "../../types";


interface EditableStop extends TripLocationCreate {
  tempId: number;
}

export default function CreateTripPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stops, setStops] = useState<EditableStop[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  function handleAddLocation(loc: LocationSearchResult) {
    const order = stops.length + 1;
    const newStop: EditableStop = {
      tempId: Date.now() + Math.random(),
      location_area_name: loc.name,
      location_area_slug: loc.slug,
      arrival_date: new Date().toISOString().slice(0, 10),
      duration_days: 1,
      order,
    };
    setStops((prev) => [...prev, newStop]);
  }

  function updateStop(id: number, patch: Partial<EditableStop>) {
    setStops((prev) =>
      prev.map((s) => (s.tempId === id ? { ...s, ...patch } : s))
    );
  }

  function removeStop(id: number) {
    setStops((prev) => prev.filter((s) => s.tempId !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Trip name is required");
      return;
    }
    if (stops.length === 0) {
      setError("Add at least one location");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        description: description || undefined,
        stops: stops.map<TripLocationCreate>((s) => ({
          location_area_name: s.location_area_name,
          location_area_slug: s.location_area_slug,
          arrival_date: s.arrival_date,
          duration_days: s.duration_days,
          order: s.order,
        })),
      };

      const created = await createTrip(payload);
      navigate(`/trips/${created.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create trip");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2>Create Trip</h2>
      <form onSubmit={handleSubmit} className="card">
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Trip name
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Description (optional)
            <br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Search and add locations</label>
          <LocationSearchInput onSelect={handleAddLocation} />
        </div>

        {stops.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Stops</h3>
            {stops.map((stop) => (
              <div
                key={stop.tempId}
                style={{
                  border: "1px solid #ddd",
                  padding: "0.5rem",
                  borderRadius: 4,
                  marginBottom: "0.5rem",
                }}
              >
                <strong>#{stop.order} – {stop.location_area_name}</strong>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <div>
                    <label>
                      Arrival date
                      <br />
                      <input
                        type="date"
                        value={stop.arrival_date}
                        onChange={(e) =>
                          updateStop(stop.tempId, {
                            arrival_date: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Duration (days)
                      <br />
                      <input
                        type="number"
                        min={1}
                        value={stop.duration_days}
                        onChange={(e) =>
                          updateStop(stop.tempId, {
                            duration_days: Number(e.target.value),
                          })
                        }
                        style={{ width: 80 }}
                      />
                    </label>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => removeStop(stop.tempId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Trip"}
        </button>
      </form>
    </div>
  );
}
