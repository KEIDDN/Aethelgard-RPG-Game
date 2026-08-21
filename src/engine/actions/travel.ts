import type { GameState } from "../gameState";

export function canTravelTo(state: GameState, targetLocationId: string): boolean {
  const current = state.world.region.locations.find((l) => l.id === state.player.currentLocationId);
  return current?.connections.includes(targetLocationId) ?? false;
}

export function travel(state: GameState, targetLocationId: string): GameState {
  if (!canTravelTo(state, targetLocationId)) {
    throw new Error(`No se puede viajar desde ${state.player.currentLocationId} a ${targetLocationId}.`);
  }

  const target = state.world.region.locations.find((l) => l.id === targetLocationId)!;

  return {
    ...state,
    player: {
      ...state.player,
      currentLocationId: targetLocationId,
    },
    history: [...state.history, `Viajaste a ${target.name}.`],
  };
}
