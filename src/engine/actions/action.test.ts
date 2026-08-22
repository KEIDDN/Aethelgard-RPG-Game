import { describe, expect, it } from "vitest";
import { createGameState } from "../gameState";
import { canPerformAction, resolveAction } from "./action";

describe("resolveAction", () => {
  it("resolves TRAVEL the same way as the underlying travel() function", () => {
    const state = createGameState("Hero", "guerrero", 1);
    const destination = state.world.region.locations.find(
      (l) => l.id !== state.player.currentLocationId,
    )!;

    const next = resolveAction(state, { type: "TRAVEL", targetLocationId: destination.id });

    expect(next.player.currentLocationId).toBe(destination.id);
  });

  it("throws on an invalid TRAVEL destination instead of mutating state", () => {
    const state = createGameState("Hero", "guerrero", 1);
    expect(canPerformAction(state, { type: "TRAVEL", targetLocationId: "not-a-real-place" })).toBe(
      false,
    );
    expect(() => resolveAction(state, { type: "TRAVEL", targetLocationId: "not-a-real-place" })).toThrow();
  });

  it("resolves REST by restoring HP and advancing the clock", () => {
    const state = createGameState("Hero", "mago", 1);
    const wounded = { ...state, player: { ...state.player, currentHp: 1 } };

    const rested = resolveAction(wounded, { type: "REST" });

    expect(rested.player.currentHp).toBe(rested.player.maxHp);
    expect(rested.clock.day).toBe(state.clock.day + 1);
  });

  it("rejects every action type once the player is defeated, including REST", () => {
    const state = createGameState("Hero", "guerrero", 1);
    const fallen = { ...state, player: { ...state.player, currentHp: 0 } };
    const destination = fallen.world.region.locations.find(
      (l) => l.id !== fallen.player.currentLocationId,
    )!;

    for (const action of [
      { type: "REST" as const },
      { type: "INVESTIGATE" as const },
      { type: "ATTACK" as const },
      { type: "TRAVEL" as const, targetLocationId: destination.id },
    ]) {
      expect(canPerformAction(fallen, action)).toBe(false);
      expect(() => resolveAction(fallen, action)).toThrow();
    }
  });
});
