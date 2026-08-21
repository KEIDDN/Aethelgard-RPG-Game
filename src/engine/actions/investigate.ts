import { attributeModifier, rollForState } from "../dice/dice";
import type { GameState } from "../gameState";

const INVESTIGATE_DC = 12;
const TRAP_DAMAGE = 2;

export function canInvestigate(_state: GameState): boolean {
  return true;
}

export function investigate(state: GameState): GameState {
  const location = state.world.region.locations.find(
    (l) => l.id === state.player.currentLocationId,
  )!;
  const modifier = attributeModifier(state.player.attributes.inteligencia);
  const { result, state: rolledState } = rollForState(state, 20, modifier);
  const success = result.total >= INVESTIGATE_DC;

  if (location.dangerous) {
    if (success) {
      return {
        ...rolledState,
        history: [
          ...rolledState.history,
          `Investigas con cautela y evitas el peligro. (tirada: ${result.total})`,
        ],
      };
    }

    const currentHp = Math.max(0, rolledState.player.currentHp - TRAP_DAMAGE);
    return {
      ...rolledState,
      player: { ...rolledState.player, currentHp },
      history: [
        ...rolledState.history,
        `Una trampa te hiere mientras investigas. Pierdes ${TRAP_DAMAGE} PV. (tirada: ${result.total})`,
      ],
    };
  }

  const message = success
    ? `Investigas la zona y encuentras algo interesante. (tirada: ${result.total})`
    : `No encuentras nada de interés. (tirada: ${result.total})`;

  return {
    ...rolledState,
    history: [...rolledState.history, message],
  };
}
