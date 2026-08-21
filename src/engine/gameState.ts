import { generateCampaignSeed, type Seed } from "./rng";

export interface Campaign {
  id: string;
  seed: Seed;
  createdAt: number;
}

export interface Player {
  name: string;
}

export interface Clock {
  day: number;
}

export interface GameState {
  campaign: Campaign;
  player: Player;
  clock: Clock;
  history: string[];
}

export function createGameState(playerName: string, seed: Seed = generateCampaignSeed()): GameState {
  return {
    campaign: {
      id: crypto.randomUUID(),
      seed,
      createdAt: Date.now(),
    },
    player: {
      name: playerName,
    },
    clock: {
      day: 1,
    },
    history: [`Campaña iniciada con semilla ${seed}.`],
  };
}
