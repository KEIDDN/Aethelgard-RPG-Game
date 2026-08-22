import { useState } from "react";
import { resolveAction } from "./engine/actions/action";
import { ARCHETYPES, type Archetype } from "./engine/character/archetypes";
import { XP_PER_LEVEL } from "./engine/character/progression";
import { createGameState, isDefeated, type GameState } from "./engine/gameState";
import { deleteCampaign, listCampaigns, saveCampaign } from "./persistence/campaignStorage";
import "./App.css";

export default function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [archetype, setArchetype] = useState<Archetype>("guerrero");
  const [campaigns, setCampaigns] = useState<GameState[]>(() => listCampaigns());

  const startCampaign = () => {
    const newState = createGameState(playerName || "Aventurero sin nombre", archetype);
    setState(newState);
  };

  const handleSave = () => {
    if (!state) return;
    saveCampaign(state);
    setCampaigns(listCampaigns());
  };

  const handleLoad = (campaign: GameState) => {
    setState(campaign);
  };

  const handleDelete = (id: string) => {
    deleteCampaign(id);
    setCampaigns(listCampaigns());
    if (state?.campaign.id === id) setState(null);
  };

  const handleTravel = (locationId: string) => {
    if (!state) return;
    setState(resolveAction(state, { type: "TRAVEL", targetLocationId: locationId }));
  };

  const handleRest = () => {
    if (!state) return;
    setState(resolveAction(state, { type: "REST" }));
  };

  const handleInvestigate = () => {
    if (!state) return;
    setState(resolveAction(state, { type: "INVESTIGATE" }));
  };

  const handleAttack = () => {
    if (!state) return;
    setState(resolveAction(state, { type: "ATTACK" }));
  };

  const handleTalk = () => {
    if (!state) return;
    setState(resolveAction(state, { type: "TALK" }));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Aethelgard</h1>
        <p className="app-tagline">Un mundo procedural, una aventura distinta cada vez</p>
      </header>

      {!state && (
        <>
          <section className="panel">
            <div className="panel-header">
              <h2>Nueva Campaña</h2>
            </div>

            <div>
              <label className="field-label" htmlFor="player-name">
                Nombre del personaje
              </label>
              <input
                id="player-name"
                className="text-input"
                placeholder="Nombre del personaje"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>

            <h3>Arquetipo</h3>
            <ul className="archetype-list">
              {Object.values(ARCHETYPES).map((def) => (
                <li key={def.id}>
                  <label className={`archetype-card${archetype === def.id ? " is-selected" : ""}`}>
                    <input
                      type="radio"
                      name="archetype"
                      checked={archetype === def.id}
                      onChange={() => setArchetype(def.id)}
                    />
                    <span className="archetype-name">{def.name}</span>
                    <span className="archetype-desc">{def.description}</span>
                    <span className="archetype-stats">
                      <span>PV {def.maxHp}</span>
                      <span>FUE {def.attributes.fuerza}</span>
                      <span>DES {def.attributes.destreza}</span>
                      <span>INT {def.attributes.inteligencia}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <button className="btn btn-primary" onClick={startCampaign}>
              Iniciar campaña
            </button>
          </section>

          {campaigns.length > 0 && (
            <section className="panel">
              <div className="panel-header">
                <h2>Cargar Campaña</h2>
              </div>
              <ul className="campaign-list">
                {campaigns.map((c) => (
                  <li key={c.campaign.id} className="campaign-item">
                    <span className="campaign-meta">
                      {c.player.name} — semilla {c.campaign.seed} — día {c.clock.day}
                    </span>
                    <span className="btn-row">
                      <button className="btn" onClick={() => handleLoad(c)}>
                        Cargar
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(c.campaign.id)}>
                        Eliminar
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {state &&
        (() => {
          const hpPct = Math.round((state.player.currentHp / state.player.maxHp) * 100);
          const xpThreshold = state.player.level * XP_PER_LEVEL;
          const xpPct = Math.round((state.player.xp / xpThreshold) * 100);
          const defeated = isDefeated(state);
          const current = state.world.region.locations.find(
            (l) => l.id === state.player.currentLocationId,
          )!;
          const npcHere = state.world.npcs.filter((npc) => npc.locationId === current.id);

          return (
            <div className="layout">
              <aside className="sidebar">
                <section className="panel">
                  <div className="panel-header">
                    <h2>{state.player.name}</h2>
                    <span className="char-level">Nv. {state.player.level}</span>
                  </div>

                  <div className="stat-block">
                    <div className="stat-row">
                      <span className="label">{ARCHETYPES[state.player.archetype].name}</span>
                      <span>
                        {state.player.currentHp}/{state.player.maxHp} PV
                      </span>
                    </div>
                    <div className="bar">
                      <div className="bar-fill bar-fill--hp" style={{ width: `${hpPct}%` }} />
                    </div>

                    <div className="stat-row">
                      <span className="label">Experiencia</span>
                      <span>
                        {state.player.xp}/{xpThreshold} XP
                      </span>
                    </div>
                    <div className="bar">
                      <div className="bar-fill bar-fill--xp" style={{ width: `${xpPct}%` }} />
                    </div>
                  </div>

                  <p className="gold-line">🪙 {state.player.gold} de oro</p>

                  <p className="attributes">
                    <span>
                      FUE <b>{state.player.attributes.fuerza}</b>
                    </span>
                    <span>
                      DES <b>{state.player.attributes.destreza}</b>
                    </span>
                    <span>
                      INT <b>{state.player.attributes.inteligencia}</b>
                    </span>
                  </p>
                </section>

                <section className="panel">
                  <div className="panel-header">
                    <h3>Campaña</h3>
                  </div>
                  <p className="campaign-meta">Semilla: {state.campaign.seed}</p>
                  <p className="campaign-meta">Región: {state.world.region.name}</p>
                  <p className="campaign-meta">Día: {state.clock.day}</p>
                </section>

                {state.world.quest.accepted && (
                  <section className="panel quest-panel">
                    <div className="panel-header">
                      <h3>Misión</h3>
                      <span
                        className={`quest-status${state.world.quest.completed ? " is-complete" : ""}`}
                      >
                        {state.world.quest.completed ? "Completada" : "En curso"}
                      </span>
                    </div>
                    <p className="quest-title">{state.world.quest.title}</p>
                    <p className="quest-desc">{state.world.quest.description}</p>
                  </section>
                )}
              </aside>

              <div className="main-column">
                {defeated ? (
                  <section className="panel game-over-panel">
                    <h3>Has caído en combate</h3>
                    <p>Tu aventura termina aquí. Puedes guardar este momento o volver al menú.</p>
                  </section>
                ) : (
                  <section className="panel">
                    <div className="panel-header">
                      <h2>Ubicación actual</h2>
                    </div>
                    <p className="location-name">
                      {current.name}
                      {current.dangerous ? (
                        <span className="badge-danger">⚠ Peligro</span>
                      ) : (
                        <span className="badge-safe">Seguro</span>
                      )}
                    </p>

                    {npcHere.map((npc) => (
                      <div className="npc-card" key={npc.id}>
                        <span className="npc-name">🗣 {npc.name}</span>
                        <button className="btn" onClick={handleTalk}>
                          Hablar
                        </button>
                      </div>
                    ))}

                    {current.enemy && current.enemy.currentHp > 0 && (
                      <div className="encounter-card">
                        <div className="encounter-header">
                          <span className="encounter-name">☠ {current.enemy.name}</span>
                          <span>
                            {current.enemy.currentHp}/{current.enemy.maxHp} PV
                          </span>
                        </div>
                        <div className="bar">
                          <div
                            className="bar-fill bar-fill--hp"
                            style={{
                              width: `${Math.round((current.enemy.currentHp / current.enemy.maxHp) * 100)}%`,
                            }}
                          />
                        </div>
                        <button className="btn btn-danger" onClick={handleAttack}>
                          Atacar
                        </button>
                      </div>
                    )}

                    <div className="btn-row">
                      <button className="btn" onClick={handleInvestigate}>
                        Investigar
                      </button>
                      <button className="btn" onClick={handleRest}>
                        Descansar
                      </button>
                    </div>

                    <h4>Viajar a</h4>
                    <ul className="travel-list">
                      {current.connections.map((id) => {
                        const target = state.world.region.locations.find((l) => l.id === id)!;
                        return (
                          <li key={id} className="travel-item">
                            <span className="travel-item-name">
                              {target.name}
                              {target.dangerous && <span className="badge-danger">⚠</span>}
                            </span>
                            <button className="btn" onClick={() => handleTravel(id)}>
                              Viajar
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                <section className="panel">
                  <div className="panel-header">
                    <h3>Historia</h3>
                  </div>
                  <ul className="history-log">
                    {state.history
                      .slice()
                      .reverse()
                      .map((entry, i) => (
                        <li key={state.history.length - i} className="history-entry">
                          {entry}
                        </li>
                      ))}
                  </ul>
                </section>

                <div className="btn-row">
                  <button className="btn" onClick={handleSave}>
                    Guardar
                  </button>
                  <button className="btn" onClick={() => setState(null)}>
                    Volver al menú
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
