import { type PokemonExtraLocation } from "../types";


interface Props {
  pokemonName: string;
  extraLocations: PokemonExtraLocation[] | null;
  onClose: () => void;
}

export default function PokemonModal({
  pokemonName,
  extraLocations,
  onClose,
}: Props) {
  if (!extraLocations) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: 500, width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Other locations for {pokemonName}</h3>
        {extraLocations.length === 0 ? (
          <p>No other locations found outside this trip.</p>
        ) : (
          <ul>
            {extraLocations.map((loc) => (
              <li key={loc.location_area_url}>{loc.location_area_name}</li>
            ))}
          </ul>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
