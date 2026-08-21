import { useState } from "react";
import { createGameState, type GameState } from "./engine/gameState";
import { deleteCampaign, listCampaigns, saveCampaign } from "./persistence/campaignStorage";
import "./App.css";

export default function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [campaigns, setCampaigns] = useState<GameState[]>(() => listCampaigns());

  const startCampaign = () => {
    const newState = createGameState(playerName || "Aventurero sin nombre");
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
          <p>Día: {state.clock.day}</p>
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
