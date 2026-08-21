import { describe, expect, it } from "vitest";
import { createGameState } from "../gameState";
import { attributeModifier, rollForState } from "./dice";

describe("attributeModifier", () => {
  it("follows the standard tabletop (score - 10) / 2 formula", () => {
    expect(attributeModifier(10)).toBe(0);
    expect(attributeModifier(11)).toBe(0);
    expect(attributeModifier(15)).toBe(2);
    expect(attributeModifier(8)).toBe(-1);
    expect(attributeModifier(20)).toBe(5);
  });
});

describe("rollForState", () => {
  it("produces a value within the die's range and increments rollCount", () => {
    const state = createGameState("Hero", "guerrero", 1);
    const { result, state: next } = rollForState(state, 20, 3);

    expect(result.roll).toBeGreaterThanOrEqual(1);
    expect(result.roll).toBeLessThanOrEqual(20);
    expect(result.total).toBe(result.roll + 3);
    expect(next.campaign.rollCount).toBe(state.campaign.rollCount + 1);
  });

  it("is deterministic for the same seed and rollCount", () => {
    const state = createGameState("Hero", "guerrero", 1);
    const a = rollForState(state, 20);
    const b = rollForState(state, 20);

    expect(a.result).toEqual(b.result);
  });

  it("varies rolls as rollCount advances", () => {
    let state = createGameState("Hero", "guerrero", 1);
    const rolls: number[] = [];

    for (let i = 0; i < 20; i++) {
      const { result, state: next } = rollForState(state, 20);
      rolls.push(result.roll);
      state = next;
    }

    expect(new Set(rolls).size).toBeGreaterThan(1);
  });
});
