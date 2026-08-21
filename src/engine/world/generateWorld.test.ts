import { describe, expect, it } from "vitest";
import { generateWorld } from "./generateWorld";

function isReachableFromStart(world: ReturnType<typeof generateWorld>): boolean {
  const visited = new Set<string>([world.startingLocationId]);
  const queue = [world.startingLocationId];
  const byId = new Map(world.region.locations.map((l) => [l.id, l]));

  while (queue.length > 0) {
    const current = byId.get(queue.shift()!)!;
    for (const neighborId of current.connections) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
  }

  return world.region.locations.every((l) => visited.has(l.id));
}

describe("generateWorld", () => {
  it("is deterministic for the same seed", () => {
    expect(generateWorld(777)).toEqual(generateWorld(777));
  });

  it("varies across seeds", () => {
    const worldA = generateWorld(1);
    const worldB = generateWorld(2);
    expect(worldA).not.toEqual(worldB);
  });

  it("keeps every location reachable from the starting location", () => {
    for (const seed of [1, 2, 3, 42, 999]) {
      expect(isReachableFromStart(generateWorld(seed))).toBe(true);
    }
  });

  it("always includes exactly one dangerous location", () => {
    const world = generateWorld(123);
    const dangerous = world.region.locations.filter((l) => l.dangerous);
    expect(dangerous).toHaveLength(1);
  });
});
