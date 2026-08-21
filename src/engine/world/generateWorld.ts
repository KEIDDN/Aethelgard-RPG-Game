import { SeededRNG, type Seed } from "../rng";
import {
  DUNGEON_NAMES,
  ENEMY_NAMES,
  LANDMARK_NAMES,
  REGION_PREFIXES,
  REGION_SUFFIXES,
  SETTLEMENT_NAMES,
} from "./names";
import type { Enemy, Location, World } from "./types";

export function generateWorld(seed: Seed): World {
  const rng = new SeededRNG(seed);

  const regionName = `${rng.pick(REGION_PREFIXES)} ${rng.pick(REGION_SUFFIXES)}`;
  const settlementName = rng.pick(SETTLEMENT_NAMES);
  const dungeonName = rng.pick(DUNGEON_NAMES);
  const landmarkCount = rng.int(1, 2);
  const landmarkNames = rng.shuffle(LANDMARK_NAMES).slice(0, landmarkCount);

  const enemyMaxHp = rng.int(8, 14);
  const enemy: Enemy = {
    id: "dungeon_enemy",
    name: rng.pick(ENEMY_NAMES),
    maxHp: enemyMaxHp,
    currentHp: enemyMaxHp,
    armorClass: rng.int(10, 13),
    damage: rng.int(2, 4),
  };

  const settlement: Location = {
    id: "settlement",
    name: settlementName,
    type: "settlement",
    dangerous: false,
    connections: [],
  };

  const dungeon: Location = {
    id: "dungeon",
    name: dungeonName,
    type: "dungeon",
    dangerous: true,
    connections: [settlement.id],
    enemy,
  };

  const landmarks: Location[] = landmarkNames.map((name, i) => ({
    id: `landmark_${i}`,
    name,
    type: "landmark",
    dangerous: false,
    connections: [settlement.id],
  }));

  settlement.connections = [dungeon.id, ...landmarks.map((l) => l.id)];

  return {
    region: {
      name: regionName,
      locations: [settlement, dungeon, ...landmarks],
    },
    startingLocationId: settlement.id,
  };
}
