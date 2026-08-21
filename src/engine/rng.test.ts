import { describe, expect, it } from "vitest";
import { SeededRNG, deriveSeed } from "./rng";

describe("SeededRNG", () => {
  it("produces identical sequences for the same seed", () => {
    const a = new SeededRNG(12345);
    const b = new SeededRNG(12345);
    const sequenceA = Array.from({ length: 10 }, () => a.next());
    const sequenceB = Array.from({ length: 10 }, () => b.next());
    expect(sequenceA).toEqual(sequenceB);
  });

  it("produces different sequences for different seeds", () => {
    const a = new SeededRNG(1);
    const b = new SeededRNG(2);
    expect(a.next()).not.toEqual(b.next());
  });

  it("int() stays within the requested range", () => {
    const rng = new SeededRNG(42);
    for (let i = 0; i < 100; i++) {
      const value = rng.int(1, 20);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(20);
    }
  });
});

describe("deriveSeed", () => {
  it("is deterministic for the same inputs", () => {
    expect(deriveSeed(100, "npc", "guard_01")).toEqual(deriveSeed(100, "npc", "guard_01"));
  });

  it("differs when any part changes", () => {
    expect(deriveSeed(100, "npc", "guard_01")).not.toEqual(deriveSeed(100, "npc", "guard_02"));
  });
});
