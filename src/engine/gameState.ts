import { getArchetype, type Archetype, type Attributes } from "./character/archetypes";
import { generateCampaignSeed, type Seed } from "./rng";
import { generateWorld } from "./world/generateWorld";
import type { World } from "./world/types";

export interface Campaign {
  id: string;
  seed: Seed;
  createdAt: number;
  rollCount: number;
}

export interface Player {
  name: string;
  archetype: Archetype;
  attributes: Attributes;
  maxHp: number;
  currentHp: number;
  currentLocationId: string;
}

export interface Clock {
  day: number;
}

export interface GameState {
  campaign: Campaign;
  player: Player;
  world: World;
  clock: Clock;
  history: string[];
}

export function isDefeated(state: GameState): boolean {
  return state.player.currentHp <= 0;
}

export function createGameState(
  playerName: string,
  archetype: Archetype,
  seed: Seed = generateCampaignSeed(),
): GameState {
  const world = generateWorld(seed);
  const definition = getArchetype(archetype);

  return {
    campaign: {
      id: crypto.randomUUID(),
      seed,
      createdAt: Date.now(),
      rollCount: 0,
    },
    player: {
      name: playerName,
      archetype,
      attributes: { ...definition.attributes },
      maxHp: definition.maxHp,
      currentHp: definition.maxHp,
      currentLocationId: world.startingLocationId,
    },
    world,
    clock: {
      day: 1,
    },
    history: [
      `Campaña iniciada con semilla ${seed}.`,
      `${definition.name} listo para la aventura.`,
      `El mundo generado se llama "${world.region.name}".`,
    ],
  };
}
