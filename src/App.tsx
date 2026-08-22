import { useState } from "react";
import { resolveAction } from "./engine/actions/action";
import { ARCHETYPES, type Archetype } from "./engine/character/archetypes";
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
    <main className="app">
      <h1>Aethelgard</h1>

      {!state && (
        <section>
          <h2>Nueva Campaña</h2>
          <input
            placeholder="Nombre del personaje"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <h3>Arquetipo</h3>
          <ul>
            {Object.values(ARCHETYPES).map((def) => (
              <li key={def.id}>
                <label>
                  <input
                    type="radio"
                    name="archetype"
                    checked={archetype === def.id}
                    onChange={() => setArchetype(def.id)}
                  />
                  <strong>{def.name}</strong> — {def.description} (PV {def.maxHp}, FUE{" "}
                  {def.attributes.fuerza}, DES {def.attributes.destreza}, INT{" "}
                  {def.attributes.inteligencia})
                </label>
              </li>
            ))}
          </ul>

          <button onClick={startCampaign}>Iniciar campaña</button>

          {campaigns.length > 0 && (
            <>
              <h2>Cargar Campaña</h2>
              <ul>
                {campaigns.map((c) => (
                  <li key={c.campaign.id}>
                    {c.player.name} — semilla {c.campaign.seed} — día {c.clock.day}
                    <button onClick={() => handleLoad(c)}>Cargar</button>
                    <button onClick={() => handleDelete(c.campaign.id)}>Eliminar</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {state && (
        <section>
          <h2>{state.player.name}</h2>
          <p>Semilla de campaña: {state.campaign.seed}</p>
          <p>Región: {state.world.region.name}</p>
          <p>Día: {state.clock.day}</p>

          <h3>Personaje</h3>
          <p>{ARCHETYPES[state.player.archetype].name}</p>
          <p>
            PV: {state.player.currentHp} / {state.player.maxHp}
          </p>
          <p>
            FUE {state.player.attributes.fuerza} · DES {state.player.attributes.destreza} · INT{" "}
            {state.player.attributes.inteligencia}
          </p>

          {state.world.quest.accepted && (
            <>
              <h3>Misión</h3>
              <p>
                {state.world.quest.title} — {state.world.quest.completed ? "Completada" : "En curso"}
              </p>
              <p>{state.world.quest.description}</p>
            </>
          )}

          {isDefeated(state) && (
            <section>
              <h3>Has caído en combate</h3>
              <p>Tu aventura termina aquí. Puedes guardar este momento o volver al menú.</p>
            </section>
          )}

          {!isDefeated(state) && (
            <>
              <h3>Ubicación actual</h3>
              {(() => {
                const current = state.world.region.locations.find(
                  (l) => l.id === state.player.currentLocationId,
                )!;
                return (
                  <>
                    <p>
                      {current.name} {current.dangerous && "⚠️"}
                    </p>
                    {state.world.npcs
                      .filter((npc) => npc.locationId === current.id)
                      .map((npc) => (
                        <p key={npc.id}>
                          {npc.name}
                          <button onClick={handleTalk}>Hablar</button>
                        </p>
                      ))}
                    {current.enemy && current.enemy.currentHp > 0 && (
                      <p>
                        {current.enemy.name} — PV {current.enemy.currentHp}/{current.enemy.maxHp}
                        <button onClick={handleAttack}>Atacar</button>
                      </p>
                    )}
                    <button onClick={handleInvestigate}>Investigar</button>
                    <h4>Viajar a</h4>
                    <ul>
                      {current.connections.map((id) => {
                        const target = state.world.region.locations.find((l) => l.id === id)!;
                        return (
                          <li key={id}>
                            {target.name} {target.dangerous && "⚠️"}
                            <button onClick={() => handleTravel(id)}>Viajar</button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                );
              })()}
            </>
          )}

          <h3>Historia</h3>
          <ul>
            {state.history.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
          {!isDefeated(state) && <button onClick={handleRest}>Descansar</button>}
          <button onClick={handleSave}>Guardar</button>
          <button onClick={() => setState(null)}>Volver al menú</button>
        </section>
      )}
    </main>
  );
}
