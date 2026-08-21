import { beforeEach, describe, expect, it } from "vitest";
import { createGameState } from "../engine/gameState";
import { deleteCampaign, listCampaigns, loadCampaign, saveCampaign } from "./campaignStorage";

beforeEach(() => {
  localStorage.clear();
});

describe("campaignStorage", () => {
  it("round-trips a campaign through save/load", () => {
    const state = createGameState("Test Hero", 999);
    saveCampaign(state);
    const loaded = loadCampaign(state.campaign.id);
    expect(loaded).toEqual(state);
  });

  it("lists saved campaigns", () => {
    const a = createGameState("Hero A", 1);
    const b = createGameState("Hero B", 2);
    saveCampaign(a);
    saveCampaign(b);
    const ids = listCampaigns().map((c) => c.campaign.id);
    expect(ids).toContain(a.campaign.id);
    expect(ids).toContain(b.campaign.id);
  });

  it("removes a campaign on delete", () => {
    const state = createGameState("Hero C", 3);
    saveCampaign(state);
    deleteCampaign(state.campaign.id);
    expect(loadCampaign(state.campaign.id)).toBeNull();
    expect(listCampaigns().map((c) => c.campaign.id)).not.toContain(state.campaign.id);
  });
});
