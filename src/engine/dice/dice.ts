import type { GameState } from "../gameState";
import { deriveSeed, SeededRNG } from "../rng";

export type DieSides = 4 | 6 | 8 | 10 | 12 | 20 | 100;

export interface RollResult {
  die: DieSides;
  roll: number;
  modifier: number;
  total: number;
}

export function attributeModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function rollForState(
  state: GameState,
  sides: DieSides,
  modifier = 0,
): { result: RollResult; state: GameState } {
  const rollSeed = deriveSeed(state.campaign.seed, "roll", state.campaign.rollCount);
  const rng = new SeededRNG(rollSeed);
  const roll = rng.int(1, sides);

  return {
    result: { die: sides, roll, modifier, total: roll + modifier },
    state: {
      ...state,
      campaign: { ...state.campaign, rollCount: state.campaign.rollCount + 1 },
    },
  };
}
