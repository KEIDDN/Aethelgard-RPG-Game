import type { GameState } from "../engine/gameState";

const INDEX_KEY = "aethelgard:campaigns";
const campaignKey = (id: string) => `aethelgard:campaign:${id}`;

function readIndex(): string[] {
  const raw = localStorage.getItem(INDEX_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

function writeIndex(ids: string[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

export function saveCampaign(state: GameState): void {
  localStorage.setItem(campaignKey(state.campaign.id), JSON.stringify(state));
  const ids = readIndex();
  if (!ids.includes(state.campaign.id)) {
    writeIndex([...ids, state.campaign.id]);
  }
}

export function loadCampaign(id: string): GameState | null {
  const raw = localStorage.getItem(campaignKey(id));
  return raw ? (JSON.parse(raw) as GameState) : null;
}

export function listCampaigns(): GameState[] {
  return readIndex()
    .map(loadCampaign)
    .filter((state): state is GameState => state !== null);
}

export function deleteCampaign(id: string): void {
  localStorage.removeItem(campaignKey(id));
  writeIndex(readIndex().filter((existingId) => existingId !== id));
}
