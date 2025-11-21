import { useEffect, useState } from "react";

import { searchLocations } from "../api/client";
import { type LocationSearchResult } from "../types";


interface Props {
  onSelect: (loc: LocationSearchResult) => void;
}

export default function LocationSearchInput({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchLocations(query.trim());
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Search location areas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "0.5rem" }}
      />
      {loading && <small>Searching…</small>}
      {results.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "0.25rem",
            border: "1px solid #ddd",
            borderRadius: 4,
            position: "absolute",
            background: "white",
            width: "100%",
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {results.map((r) => (
            <li
              key={r.slug}
              style={{ padding: "0.25rem 0.5rem", cursor: "pointer" }}
              onClick={() => {
                onSelect(r);
                setQuery("");
                setResults([]);
              }}
            >
              {r.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
