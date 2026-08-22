import type { Player } from "../gameState";

export const XP_PER_LEVEL = 20;
const HP_GAIN_PER_LEVEL = 5;

export interface XpGainResult {
  player: Player;
  leveledUp: boolean;
  newLevel: number;
}

export function gainXp(player: Player, amount: number): XpGainResult {
  let xp = player.xp + amount;
  let level = player.level;
  let maxHp = player.maxHp;
  let currentHp = player.currentHp;
  let leveledUp = false;

  while (xp >= level * XP_PER_LEVEL) {
    xp -= level * XP_PER_LEVEL;
    level += 1;
    maxHp += HP_GAIN_PER_LEVEL;
    currentHp = maxHp;
    leveledUp = true;
  }

  return {
    player: { ...player, xp, level, maxHp, currentHp },
    leveledUp,
    newLevel: level,
  };
}
