import { generateCampaignSeed, type Seed } from "./rng";
import { generateWorld } from "./world/generateWorld";
import type { World } from "./world/types";

export interface Campaign {
  id: string;
  seed: Seed;
  createdAt: number;
}

export interface Player {
  name: string;
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

export function createGameState(playerName: string, seed: Seed = generateCampaignSeed()): GameState {
  const world = generateWorld(seed);

  return {
    campaign: {
      id: crypto.randomUUID(),
      seed,
      createdAt: Date.now(),
    },
    player: {
      name: playerName,
      currentLocationId: world.startingLocationId,
    },
    world,
    clock: {
      day: 1,
    },
    history: [
      `Campaña iniciada con semilla ${seed}.`,
      `El mundo generado se llama "${world.region.name}".`,
    ],
  };
}
