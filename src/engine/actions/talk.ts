import type { GameState } from "../gameState";
import type { NPC, Quest } from "../world/types";

function npcAtCurrentLocation(state: GameState): NPC | undefined {
  return state.world.npcs.find((n) => n.locationId === state.player.currentLocationId);
}

function isObjectiveDone(state: GameState, quest: Quest): boolean {
  const objective = state.world.region.locations.find((l) => l.id === quest.objectiveLocationId);
  return objective?.enemy ? objective.enemy.currentHp <= 0 : false;
}

export function canTalk(state: GameState): boolean {
  return !!npcAtCurrentLocation(state);
}

const QUEST_GOLD_REWARD = 20;

function withQuest(state: GameState, quest: Quest): GameState {
  return { ...state, world: { ...state.world, quest } };
}

export function talk(state: GameState): GameState {
  const npc = npcAtCurrentLocation(state)!;
  const quest = state.world.quest;

  if (quest.giverId !== npc.id) {
    return { ...state, history: [...state.history, `${npc.name}: «${npc.greeting}»`] };
  }

  if (!quest.accepted) {
    return {
      ...withQuest(state, { ...quest, accepted: true }),
      history: [
        ...state.history,
        `${npc.name}: «${quest.description}» (Misión aceptada: ${quest.title})`,
      ],
    };
  }

  if (!quest.completed && isObjectiveDone(state, quest)) {
    const rewarded = withQuest(state, { ...quest, completed: true });
    return {
      ...rewarded,
      player: { ...rewarded.player, gold: rewarded.player.gold + QUEST_GOLD_REWARD },
      history: [
        ...state.history,
        `${npc.name}: «¡Gracias, aventurero! Has cumplido tu palabra.» (Misión completada: ${quest.title})`,
        `Recibes ${QUEST_GOLD_REWARD} piezas de oro como recompensa.`,
      ],
    };
  }

  if (!quest.completed) {
    return {
      ...state,
      history: [...state.history, `${npc.name}: «Todavía no has terminado con esa amenaza...»`],
    };
  }

  return {
    ...state,
    history: [...state.history, `${npc.name}: «Gracias de nuevo, viajero.»`],
  };
}
