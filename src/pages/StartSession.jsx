import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerSelectionModal from "../components/PlayerSelectionModal";
import NumberStepper from "../components/NumberStepper";
import api from "../services/api";

const StartSession = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [guildCount, setGuildCount] = useState(0);
    const [guilds, setGuilds] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null); // Mensagem de alerta
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSavePlayers = (players) => {
        setSelectedPlayers(players);
    };

    const handleGuildCountChange = (count) => {
        setGuildCount(count);
        const updatedGuilds = [];
        for (let i = 0; i < count; i++) {
            updatedGuilds.push({
                id: i,
                name: guilds[i]?.name || `Guilda ${i + 1}`,
                playersCount: guilds[i]?.playersCount || 0,
            });
        }
        setGuilds(updatedGuilds);
    };

    const handleGuildNameChange = (id, newName) => {
        setGuilds((prevGuilds) =>
            prevGuilds.map((guild) =>
                guild.id === id ? { ...guild, name: newName } : guild
            )
        );
    };

    const handlePlayersCountChange = (id, newCount) => {
        const totalPlayersSelected = selectedPlayers.length;
        const playersAllocated = guilds.reduce(
            (total, guild) => total + guild.playersCount,
            0
        );
        const playersRemaining = totalPlayersSelected - playersAllocated;

        // Garante que o novo valor não ultrapasse o limite
        if (newCount > playersRemaining + guilds.find((g) => g.id === id).playersCount) {
            setAlertMessage("Número total de jogadores excedido!");
            setTimeout(() => setAlertMessage(null), 3000); // Remove o alerta após 3 segundos
            return;
        }

        setGuilds((prevGuilds) =>
            prevGuilds.map((guild) =>
                guild.id === id ? { ...guild, playersCount: newCount } : guild
            )
        );
    };

    const handleSubmit = () => {
        console.log("Sessão iniciada com os jogadores:", selectedPlayers);
        console.log("Configuração das guildas:", guilds);
        alert("Sessão iniciada com sucesso!");
    };

    return (
        <div className="container mt-5">
            {/* Botões organizados */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/sessions")}
                >
                    Voltar
                </button>
                <button
                    className="btn btn-success"
                    onClick={() => console.log("Simulação criada")}
                >
                    Criar Simulação
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={selectedPlayers.length === 0}
                >
                    Iniciar Sessão
                </button>
            </div>

            {/* Alerta de erro */}
            {alertMessage && (
                <div className="alert alert-danger" role="alert">
                    {alertMessage}
                </div>
            )}

            <h1 className="mb-4 text-center">Iniciar Sessão</h1>
            <div className="row">
                {/* Jogadores Selecionados */}
                <div className="col-md-6">
                    <h6 className="text-center">Jogadores Selecionados</h6>
                    <div className="text-center mb-3">
                        <button
                            className="btn btn-primary"
                            onClick={handleOpenModal}
                        >
                            Selecionar Jogadores
                        </button>
                    </div>
                    <table className="table table-striped text-center">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Classe</th>
                                <th>XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPlayers.map((player) => (
                                <tr key={player.id}>
                                    <td>{player.name}</td>
                                    <td>{player.class.name || "Sem classe"}</td>
                                    <td>{player.xp || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Configurar Guildas */}
                <div className="col-md-6">
                    <h6 className="text-center">Configurar Guildas</h6>
                    <div className="d-flex justify-content-center mb-3">
                        <NumberStepper
                            value={guildCount}
                            onChange={handleGuildCountChange}
                        />
                    </div>
                    <table className="table table-striped text-center">
                        <thead>
                            <tr>
                                <th>Nome da Guilda</th>
                                <th>Jogadores</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guilds.map((guild) => (
                                <tr key={guild.id}>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={guild.name}
                                            onChange={(e) =>
                                                handleGuildNameChange(
                                                    guild.id,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <NumberStepper
                                            value={guild.playersCount}
                                            onChange={(newCount) =>
                                                handlePlayersCountChange(
                                                    guild.id,
                                                    newCount
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <PlayerSelectionModal
                    fetchPlayers={async () => {
                        const response = await api.getPlayers();
                        return response.data?.players || [];
                    }}
                    onClose={handleCloseModal}
                    onSave={handleSavePlayers}
                />
            )}
        </div>
    );
};

export default StartSession;
