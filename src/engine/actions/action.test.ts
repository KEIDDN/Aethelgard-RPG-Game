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
});
