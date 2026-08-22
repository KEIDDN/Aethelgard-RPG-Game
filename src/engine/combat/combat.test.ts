import { describe, expect, it } from "vitest";
import { gainXp } from "../character/progression";
import { createGameState, type GameState } from "../gameState";
import { attack, canAttack } from "./combat";

function atDungeon(state: GameState): GameState {
  const dungeon = state.world.region.locations.find((l) => l.enemy)!;
  return { ...state, player: { ...state.player, currentLocationId: dungeon.id } };
}

function findSeedWhere(predicate: (result: GameState) => boolean): { before: GameState; after: GameState } {
  for (let seed = 1; seed < 500; seed++) {
    const before = atDungeon(createGameState("Hero", "guerrero", seed));
    const after = attack(before);
    if (predicate(after)) return { before, after };
  }
  throw new Error("No seed found matching the predicate in range");
}

describe("canAttack", () => {
  it("is true when an alive enemy is present at the current location", () => {
    const state = atDungeon(createGameState("Hero", "guerrero", 1));
    expect(canAttack(state)).toBe(true);
  });

  it("is false when there is no enemy at the current location", () => {
    const state = createGameState("Hero", "guerrero", 1);
    expect(canAttack(state)).toBe(false);
  });

  it("is false once the enemy has been defeated", () => {
    const state = atDungeon(createGameState("Hero", "guerrero", 1));
    const location = state.world.region.locations.find((l) => l.id === state.player.currentLocationId)!;
    const defeated = {
      ...state,
      world: {
        ...state.world,
        region: {
          ...state.world.region,
          locations: state.world.region.locations.map((l) =>
            l.id === location.id ? { ...l, enemy: { ...l.enemy!, currentHp: 0 } } : l,
          ),
        },
      },
    };
    expect(canAttack(defeated)).toBe(false);
  });
});

describe("attack", () => {
  it("damages the enemy on a hit and leaves it alive if it survives", () => {
    const { before, after } = findSeedWhere((s) => {
      const enemy = s.world.region.locations.find((l) => l.enemy)!.enemy!;
      return enemy.currentHp > 0 && enemy.currentHp < enemy.maxHp;
    });
    const beforeEnemy = before.world.region.locations.find((l) => l.enemy)!.enemy!;
    const afterEnemy = after.world.region.locations.find((l) => l.enemy)!.enemy!;

    expect(afterEnemy.currentHp).toBeLessThan(beforeEnemy.currentHp);
    expect(after.world.region.locations.find((l) => l.enemy)!.dangerous).toBe(true);
  });

  it("clears dangerous, stops future attacks, and awards XP once the enemy is defeated", () => {
    // A single hit can't one-shot the enemy (min 8 HP vs. a few damage per hit),
    // so land enough attacks in a row to actually defeat it.
    let state = atDungeon(createGameState("Hero", "guerrero", 1));
    const enemyMaxHp = state.world.region.locations.find((l) => l.enemy)!.enemy!.maxHp;
    let playerBeforeFinalHit = state.player;

    for (let i = 0; i < 40 && canAttack(state); i++) {
      playerBeforeFinalHit = state.player;
      state = attack(state);
    }

    const location = state.world.region.locations.find((l) => l.enemy)!;
    expect(location.enemy!.currentHp).toBe(0);
    expect(location.dangerous).toBe(false);
    expect(canAttack(state)).toBe(false);
    expect(state.history.some((entry) => entry.includes("derrotado"))).toBe(true);

    const expectedXp = gainXp(playerBeforeFinalHit, enemyMaxHp * 2);
    expect(state.player.level).toBe(expectedXp.newLevel);
    expect(state.history.some((entry) => entry.includes("puntos de experiencia"))).toBe(true);
  });

  it("costs the player HP when the enemy counter-attacks and hits", () => {
    const { before, after } = findSeedWhere((s) => s.player.currentHp < s.player.maxHp);
    expect(after.player.currentHp).toBeLessThan(before.player.currentHp);
  });

  it("never lets player HP go below zero", () => {
    const state = atDungeon(createGameState("Hero", "mago", 1));
    const nearDeath = { ...state, player: { ...state.player, currentHp: 1 } };
    const after = attack(nearDeath);
    expect(after.player.currentHp).toBeGreaterThanOrEqual(0);
  });
});
