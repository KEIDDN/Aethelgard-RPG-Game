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

export interface NPC {
  id: string;
  name: string;
  locationId: string;
  greeting: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  giverId: string;
  objectiveLocationId: string;
  accepted: boolean;
  completed: boolean;
}

export interface World {
  region: Region;
  startingLocationId: string;
  npcs: NPC[];
  quest: Quest;
}
