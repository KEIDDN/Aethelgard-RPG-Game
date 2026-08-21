import { describe, expect, it } from "vitest";
import { createGameState } from "../gameState";
import { canTravelTo, travel } from "./travel";

describe("travel", () => {
  it("moves the player to a connected location", () => {
    const state = createGameState("Hero", "guerrero", 1);
    const destination = state.world.region.locations.find(
      (l) => l.id !== state.player.currentLocationId,
    )!;

    const next = travel(state, destination.id);

    expect(next.player.currentLocationId).toBe(destination.id);
    expect(next.history.at(-1)).toContain(destination.name);
  });

  it("throws when the destination is not connected", () => {
    const state = createGameState("Hero", "guerrero", 1);
    expect(canTravelTo(state, "not-a-real-place")).toBe(false);
    expect(() => travel(state, "not-a-real-place")).toThrow();
  });
});
