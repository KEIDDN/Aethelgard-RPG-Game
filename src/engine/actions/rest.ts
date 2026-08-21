import type { GameState } from "../gameState";

export function canRest(_state: GameState): boolean {
  return true;
}

export function rest(state: GameState): GameState {
  const nextDay = state.clock.day + 1;

  return {
    ...state,
    player: {
      ...state.player,
      currentHp: state.player.maxHp,
    },
    clock: {
      ...state.clock,
      day: nextDay,
    },
    history: [...state.history, `Descansaste y recuperaste tus fuerzas. Ahora es el día ${nextDay}.`],
  };
}
