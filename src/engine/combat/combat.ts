import { gainXp } from "../character/progression";
import { attributeModifier, rollForState } from "../dice/dice";
import type { GameState } from "../gameState";
import type { Location } from "../world/types";

function currentLocation(state: GameState): Location {
  return state.world.region.locations.find((l) => l.id === state.player.currentLocationId)!;
}

export function canAttack(state: GameState): boolean {
  const location = currentLocation(state);
  return !!location.enemy && location.enemy.currentHp > 0;
}

function withUpdatedLocation(state: GameState, locationId: string, changes: Partial<Location>): GameState {
  return {
    ...state,
    world: {
      ...state.world,
      region: {
        ...state.world.region,
        locations: state.world.region.locations.map((l) =>
          l.id === locationId ? { ...l, ...changes } : l,
        ),
      },
    },
  };
}

export function attack(state: GameState): GameState {
  const location = currentLocation(state);
  const enemy = location.enemy!;
  const history: string[] = [];

  const attackRoll = rollForState(state, 20, attributeModifier(state.player.attributes.fuerza));
  let working = attackRoll.state;

  let enemyHp = enemy.currentHp;
  if (attackRoll.result.total >= enemy.armorClass) {
    const damage = Math.max(1, attributeModifier(state.player.attributes.fuerza) + 3);
    enemyHp = Math.max(0, enemy.currentHp - damage);
    history.push(`Atacas a ${enemy.name} y le infliges ${damage} de daño. (tirada: ${attackRoll.result.total})`);
  } else {
    history.push(`Atacas a ${enemy.name} pero fallas. (tirada: ${attackRoll.result.total})`);
  }

  const defeated = enemyHp <= 0;
  working = withUpdatedLocation(working, location.id, {
    enemy: { ...enemy, currentHp: enemyHp },
    dangerous: !defeated,
  });

  if (defeated) {
    history.push(`¡Has derrotado a ${enemy.name}!`);

    const xpReward = enemy.maxHp * 2;
    const { player, leveledUp, newLevel } = gainXp(working.player, xpReward);
    history.push(`Ganas ${xpReward} puntos de experiencia.`);
    if (leveledUp) {
      history.push(`¡Subes al nivel ${newLevel}!`);
    }

    return { ...working, player, history: [...working.history, ...history] };
  }

  const defense = 10 + attributeModifier(state.player.attributes.destreza);
  const enemyRoll = rollForState(working, 20, 0);
  working = enemyRoll.state;

  let currentHp = state.player.currentHp;
  if (enemyRoll.result.total >= defense) {
    currentHp = Math.max(0, currentHp - enemy.damage);
    history.push(`${enemy.name} te golpea e inflige ${enemy.damage} de daño. (tirada: ${enemyRoll.result.total})`);
  } else {
    history.push(`${enemy.name} ataca pero falla. (tirada: ${enemyRoll.result.total})`);
  }

  return {
    ...working,
    player: { ...working.player, currentHp },
    history: [...working.history, ...history],
  };
}
