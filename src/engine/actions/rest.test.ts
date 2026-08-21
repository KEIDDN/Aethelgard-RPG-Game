import { describe, expect, it } from "vitest";
import { createGameState } from "../gameState";
import { rest } from "./rest";

describe("rest", () => {
  it("restores currentHp to maxHp and advances the day", () => {
    const state = createGameState("Hero", "guerrero", 1);
    const wounded = { ...state, player: { ...state.player, currentHp: 1 } };

    const rested = rest(wounded);

    expect(rested.player.currentHp).toBe(rested.player.maxHp);
    expect(rested.clock.day).toBe(state.clock.day + 1);
    expect(rested.history.at(-1)).toContain("Descansaste");
  });
});
