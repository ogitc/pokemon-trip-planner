// Basic types mirroring backend schemas

export interface TripSummary {
    id: number;
    name: string;
    description?: string | null;
    start_date: string;  // ISO date
    end_date: string;    // ISO date
    duration_days: number;
  }
  
  export interface TripStop {
    id: number;
    location_area_name: string;
    location_area_slug: string;
    arrival_date: string; // ISO date
    duration_days: number;
    order: number;
  }
  
  export interface TripDetails {
    id: number;
    name: string;
    description?: string | null;
    start_date: string;
    end_date: string;
    stops: TripStop[];
  }
  
  export interface TripLocationCreate {
    location_area_name: string;
    location_area_slug: string;
    arrival_date: string;   // ISO date
    duration_days: number;
    order: number;
  }
  
  export interface TripCreate {
    name: string;
    description?: string | null;
    stops: TripLocationCreate[];
  }
  
  export interface LocationSearchResult {
    name: string;
    slug: string;
    url: string;
  }
  
  export interface PokemonEncounter {
    name: string;
    max_chance: number;
    locations_in_trip: string[];
    encounter_methods: string[];
    encounter_conditions: string[];
  }
  
  export interface PokemonExtraLocation {
    location_area_name: string;
    location_area_url: string;
  }
  