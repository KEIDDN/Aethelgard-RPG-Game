export type LocationType = "settlement" | "dungeon" | "landmark";

export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  armorClass: number;
  damage: number;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  dangerous: boolean;
  connections: string[];
  enemy?: Enemy;
}

export interface Region {
  name: string;
  locations: Location[];
}

export interface World {
  region: Region;
  startingLocationId: string;
}
