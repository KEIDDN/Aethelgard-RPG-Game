export type LocationType = "settlement" | "dungeon" | "landmark";

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  dangerous: boolean;
  connections: string[];
}

export interface Region {
  name: string;
  locations: Location[];
}

export interface World {
  region: Region;
  startingLocationId: string;
}
