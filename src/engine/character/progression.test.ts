import { describe, expect, it } from "vitest";
import { createGameState } from "../gameState";
import { gainXp, XP_PER_LEVEL } from "./progression";

describe("gainXp", () => {
  it("accumulates XP without leveling up below the threshold", () => {
    const state = createGameState("Hero", "guerrero", 1);
    const { player, leveledUp } = gainXp(state.player, XP_PER_LEVEL - 1);

    expect(player.xp).toBe(XP_PER_LEVEL - 1);
    expect(player.level).toBe(1);
    expect(leveledUp).toBe(false);
  });

  it("levels up, increases maxHp, and fully heals when XP crosses the threshold", () => {
    const state = createGameState("Hero", "guerrero", 1);
    const wounded = { ...state.player, currentHp: 1 };

    const { player, leveledUp, newLevel } = gainXp(wounded, XP_PER_LEVEL);

    expect(leveledUp).toBe(true);
    expect(newLevel).toBe(2);
    expect(player.level).toBe(2);
    expect(player.maxHp).toBe(state.player.maxHp + 5);
    expect(player.currentHp).toBe(player.maxHp);
    expect(player.xp).toBe(0);
  });

  it("handles multiple level-ups from a single large XP gain", () => {
    const state = createGameState("Hero", "mago", 1);
    // level 1->2 costs 20, level 2->3 costs 40: 60 XP should reach level 3 exactly.
    const { player, newLevel } = gainXp(state.player, 60);

    expect(newLevel).toBe(3);
    expect(player.level).toBe(3);
    expect(player.maxHp).toBe(state.player.maxHp + 10);
  });
});
