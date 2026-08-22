import { describe, expect, it } from "vitest";
import { ARCHETYPES } from "./character/archetypes";
import { createGameState, isDefeated } from "./gameState";

describe("createGameState", () => {
  it("assigns attributes and HP from the chosen archetype", () => {
    const state = createGameState("Aldric", "guerrero", 1);
    const definition = ARCHETYPES.guerrero;

    expect(state.player.attributes).toEqual(definition.attributes);
    expect(state.player.maxHp).toBe(definition.maxHp);
    expect(state.player.currentHp).toBe(definition.maxHp);
  });

  it("is deterministic for the same seed and archetype", () => {
    const a = createGameState("Aldric", "mago", 42);
    const b = createGameState("Aldric", "mago", 42);

    expect(a.player).toEqual(b.player);
    expect(a.world).toEqual(b.world);
  });

  it("places the player at the world's starting location", () => {
    const state = createGameState("Aldric", "picaro", 7);
    expect(state.player.currentLocationId).toBe(state.world.startingLocationId);
  });
});

describe("isDefeated", () => {
  it("is false while the player has HP remaining", () => {
    const state = createGameState("Aldric", "guerrero", 1);
    expect(isDefeated(state)).toBe(false);
  });

  it("is true once currentHp reaches zero", () => {
    const state = createGameState("Aldric", "guerrero", 1);
    const fallen = { ...state, player: { ...state.player, currentHp: 0 } };
    expect(isDefeated(fallen)).toBe(true);
  });
});
