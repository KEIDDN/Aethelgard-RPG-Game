import { useState } from "react";
import { travel } from "./engine/actions/travel";
import { ARCHETYPES, type Archetype } from "./engine/character/archetypes";
import { createGameState, type GameState } from "./engine/gameState";
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
    setState(travel(state, locationId));
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

          <h3>Historia</h3>
          <ul>
            {state.history.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={() => setState(null)}>Volver al menú</button>
        </section>
      )}
    </main>
  );
}
