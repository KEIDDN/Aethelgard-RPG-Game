import type { GameState } from "../gameState";
import { canInvestigate, investigate } from "./investigate";
import { canRest, rest } from "./rest";
import { canTravelTo, travel } from "./travel";

export type Action =
  | { type: "TRAVEL"; targetLocationId: string }
  | { type: "REST" }
  | { type: "INVESTIGATE" };

export function canPerformAction(state: GameState, action: Action): boolean {
  switch (action.type) {
    case "TRAVEL":
      return canTravelTo(state, action.targetLocationId);
    case "REST":
      return canRest(state);
    case "INVESTIGATE":
      return canInvestigate(state);
  }
}

export function resolveAction(state: GameState, action: Action): GameState {
  if (!canPerformAction(state, action)) {
    throw new Error(`No se puede realizar la acción ${action.type}.`);
  }

  switch (action.type) {
    case "TRAVEL":
      return travel(state, action.targetLocationId);
    case "REST":
      return rest(state);
    case "INVESTIGATE":
      return investigate(state);
  }
}
