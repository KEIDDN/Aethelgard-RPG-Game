import { describe, expect, it } from "vitest";
import { attack } from "../combat/combat";
import { createGameState, type GameState } from "../gameState";
import { canTalk, talk } from "./talk";

function atSettlement(state: GameState): GameState {
  return { ...state, player: { ...state.player, currentLocationId: state.world.startingLocationId } };
}

function atDungeon(state: GameState): GameState {
  const dungeon = state.world.region.locations.find((l) => l.enemy)!;
  return { ...state, player: { ...state.player, currentLocationId: dungeon.id } };
}

describe("canTalk", () => {
  it("is true at the settlement where the NPC lives", () => {
    const state = atSettlement(createGameState("Hero", "guerrero", 1));
    expect(canTalk(state)).toBe(true);
  });

  it("is false where there is no NPC", () => {
    const state = atDungeon(createGameState("Hero", "guerrero", 1));
    expect(canTalk(state)).toBe(false);
  });
});

describe("talk", () => {
  it("offers and accepts the quest on the first conversation", () => {
    const state = atSettlement(createGameState("Hero", "guerrero", 1));
    expect(state.world.quest.accepted).toBe(false);

    const after = talk(state);

    expect(after.world.quest.accepted).toBe(true);
    expect(after.history.at(-1)).toContain("Misión aceptada");
  });

  it("gives a reminder on a second conversation before the objective is done", () => {
    const state = atSettlement(createGameState("Hero", "guerrero", 1));
    const accepted = talk(state);
    const reminded = talk(accepted);

    expect(reminded.world.quest.completed).toBe(false);
    expect(reminded.history.at(-1)).toContain("Todavía no has terminado");
  });

  it("completes and turns in the quest once the objective enemy is defeated", () => {
    let state = atSettlement(createGameState("Hero", "guerrero", 1));
    state = talk(state); // accept

    let dungeonState = atDungeon(state);
    for (let i = 0; i < 40; i++) {
      const location = dungeonState.world.region.locations.find((l) => l.enemy)!;
      if (location.enemy!.currentHp <= 0) break;
      dungeonState = attack(dungeonState);
    }

    const backAtSettlement = atSettlement(dungeonState);
    const turnedIn = talk(backAtSettlement);

    expect(turnedIn.world.quest.completed).toBe(true);
    expect(turnedIn.history.at(-1)).toContain("Misión completada");
  });

  it("gives idle flavor once the quest is already completed", () => {
    let state = atSettlement(createGameState("Hero", "guerrero", 1));
    state = talk(state); // accept

    let dungeonState = atDungeon(state);
    for (let i = 0; i < 40; i++) {
      const location = dungeonState.world.region.locations.find((l) => l.enemy)!;
      if (location.enemy!.currentHp <= 0) break;
      dungeonState = attack(dungeonState);
    }

    let backAtSettlement = atSettlement(dungeonState);
    backAtSettlement = talk(backAtSettlement); // turns in
    const after = talk(backAtSettlement);

    expect(after.history.at(-1)).toContain("Gracias de nuevo");
  });
});
