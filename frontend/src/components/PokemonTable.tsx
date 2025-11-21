import { useState } from "react";

import { type PokemonEncounter } from "../types";


type SortColumn =
  | "name"
  | "max_chance"
  | "locations"
  | "methods"
  | "conditions";

interface Props {
  pokemon: PokemonEncounter[];
  onClickName: (name: string) => void;
}

export default function PokemonTable({ pokemon, onClickName }: Props) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("max_chance");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(col: SortColumn) {
    if (col === sortColumn) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDir(col === "max_chance" ? "desc" : "asc");
    }
  }

  function getSorted() {
    const sorted = [...pokemon];
    sorted.sort((a, b) => {
      let av: number | string = "";
      let bv: number | string = "";

      switch (sortColumn) {
        case "name":
          av = a.name;
          bv = b.name;
          break;
        case "max_chance":
          av = a.max_chance;
          bv = b.max_chance;
          break;
        case "locations":
          av = a.locations_in_trip.join(", ");
          bv = b.locations_in_trip.join(", ");
          break;
        case "methods":
          av = a.encounter_methods.join(", ");
          bv = b.encounter_methods.join(", ");
          break;
        case "conditions":
          av = a.encounter_conditions.join(", ");
          bv = b.encounter_conditions.join(", ");
          break;
      }

      if (typeof av === "number" && typeof bv === "number") {
        return av - bv;
      }
      return String(av).localeCompare(String(bv));
    });

    if (sortDir === "desc") sorted.reverse();
    return sorted;
  }

  const sortedPokemon = getSorted();

  function header(col: SortColumn, label: string) {
    const active = sortColumn === col;
    const arrow = active ? (sortDir === "asc" ? "↑" : "↓") : "";
    return (
      <th
        onClick={() => handleSort(col)}
        style={{ cursor: "pointer", whiteSpace: "nowrap" }}
      >
        {label} {arrow}
      </th>
    );
  }

  if (pokemon.length === 0) {
    return <p>No Pokémon found for this trip yet.</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "1rem",
        fontSize: "0.9rem",
      }}
    >
      <thead>
        <tr>
          {header("name", "Name")}
          {header("max_chance", "Max Chance")}
          {header("locations", "Locations in Trip")}
          {header("methods", "Encounter Methods")}
          {header("conditions", "Encounter Conditions")}
        </tr>
      </thead>
      <tbody>
        {sortedPokemon.map((p) => (
          <tr key={p.name}>
            <td
              style={{
                padding: "0.5rem",
                borderTop: "1px solid #ddd",
                color: "#2563eb",
                cursor: "pointer",
              }}
              onClick={() => onClickName(p.name)}
            >
              {p.name}
            </td>
            <td style={{ padding: "0.5rem", borderTop: "1px solid #ddd" }}>
              {p.max_chance}
            </td>
            <td style={{ padding: "0.5rem", borderTop: "1px solid #ddd" }}>
              {p.locations_in_trip.join(", ")}
            </td>
            <td style={{ padding: "0.5rem", borderTop: "1px solid #ddd" }}>
              {p.encounter_methods.join(", ")}
            </td>
            <td style={{ padding: "0.5rem", borderTop: "1px solid #ddd" }}>
              {p.encounter_conditions.join(", ")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
