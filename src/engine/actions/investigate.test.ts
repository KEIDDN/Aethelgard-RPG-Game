import { describe, expect, it } from "vitest";
import { createGameState, type GameState } from "../gameState";
import { investigate } from "./investigate";

function atDangerousLocation(state: GameState): GameState {
  const dangerous = state.world.region.locations.find((l) => l.dangerous)!;
  return { ...state, player: { ...state.player, currentLocationId: dangerous.id } };
}

function findSeedWhere(predicate: (result: GameState) => boolean): { before: GameState; after: GameState } {
  for (let seed = 1; seed < 500; seed++) {
    const before = atDangerousLocation(createGameState("Hero", "guerrero", seed));
    const after = investigate(before);
    if (predicate(after)) return { before, after };
  }
  throw new Error("No seed found matching the predicate in range");
}

describe("investigate", () => {
  it("always advances the roll counter and appends one history entry", () => {
    const state = createGameState("Hero", "mago", 1);
    const result = investigate(state);

    expect(result.campaign.rollCount).toBe(state.campaign.rollCount + 1);
    expect(result.history).toHaveLength(state.history.length + 1);
  });

  it("costs HP on a dangerous location when the roll fails", () => {
    const { before, after } = findSeedWhere((s) => s.player.currentHp < s.player.maxHp);

    expect(after.player.currentHp).toBe(before.player.currentHp - 2);
    expect(after.history.at(-1)).toContain("Una trampa te hiere");
  });

  it("leaves HP untouched on a dangerous location when the roll succeeds", () => {
    const { before, after } = findSeedWhere((s) => s.history.at(-1)?.includes("evitas el peligro") ?? false);

    expect(after.player.currentHp).toBe(before.player.currentHp);
  });

  it("never affects HP at a non-dangerous location", () => {
    const state = createGameState("Hero", "guerrero", 1);
    const safe = state.world.region.locations.find((l) => !l.dangerous)!;
    const before = { ...state, player: { ...state.player, currentLocationId: safe.id } };

    const after = investigate(before);

    expect(after.player.currentHp).toBe(before.player.currentHp);
  });
});
