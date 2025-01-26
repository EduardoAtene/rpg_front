import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayerSelectionModal from "../components/PlayerSelectionModal";
import NumberStepper from "../components/NumberStepper";
import api from "../services/api";
import GuildComponents from "../components/GuildComponents";

const StartSession = () => {
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [guildCount, setGuildCount] = useState(0);
    const [guilds, setGuilds] = useState([]);
    const [simulationResult, setSimulationResult] = useState(null); // Resultado da simulação
    const [alertMessage, setAlertMessage] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]); // Lista de erros de validação
    const [isSimulating, setIsSimulating] = useState(false); // Estado de carregamento
    const navigate = useNavigate();

    const handleOpenModal = () => setShowModal(true);

    const handleCloseModal = () => setShowModal(false);

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

        if (newCount > playersRemaining + guilds.find((g) => g.id === id).playersCount) {
            setAlertMessage("Número total de jogadores excedido!");
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }

        setGuilds((prevGuilds) =>
            prevGuilds.map((guild) =>
                guild.id === id ? { ...guild, playersCount: newCount } : guild
            )
        );
    };

    const handleSimulate = async () => {
        const payload = {
            session_id: parseInt(id, 10),
            qnt_guilds: guilds.length,
            guilds: guilds.map((guild) => ({
                name: guild.name,
                player_count: guild.playersCount,
            })),
        };

        setIsSimulating(true);
        setValidationErrors([]); // Limpa os erros anteriores

        try {
            const response = await api.simulateGuilds(payload);
            setSimulationResult(response.data); // Salva o resultado da simulação
            alert(response.data.message); // Exibe a mensagem de sucesso
        } catch (error) {
            console.error("Erro ao realizar a simulação:", error);
            if (error.response?.data) {
                const { message, errors } = error.response.data;

                // Processa os erros de validação
                if (errors) {
                    const validationErrorMessages = [];
                    for (const [field, messages] of Object.entries(errors)) {
                        validationErrorMessages.push(...messages);
                    }
                    setValidationErrors(validationErrorMessages);
                } else {
                    // Caso seja um erro geral
                    setValidationErrors([message]);
                }
            } else {
                setValidationErrors(["Erro desconhecido. Tente novamente."]);
            }
        } finally {
            setIsSimulating(false);
        }
    };

    const handleSubmit = () => {
        handleOpenModal("start");
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate("/sessions")}>
                    Voltar
                </button>
                <button
                    className="btn btn-success"
                    onClick={handleSimulate}
                    disabled={isSimulating || guilds.length === 0}
                >
                    {isSimulating ? "Simulando..." : "Fazer Simulação"}
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={selectedPlayers.length === 0}
                >
                    Iniciar Sessão
                </button>
            </div>

            {alertMessage && (
                <div className="alert alert-danger" role="alert">
                    {alertMessage}
                </div>
            )}

            {/* Exibe erros de validação */}
            {validationErrors.length > 0 && (
                <div className="alert alert-danger" role="alert">
                    <ul>
                        {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <h1 className="mb-4 text-center">Iniciar Sessão</h1>
            <div className="row">
                <div className="col-md-6">
                    <h6 className="text-center">Jogadores Selecionados</h6>
                    <div className="text-center mb-3">
                        <button className="btn btn-primary" onClick={handleOpenModal}>
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
                <div className="col-md-6">
                    <h6 className="text-center">Configurar Guildas</h6>
                    <div className="d-flex justify-content-center mb-3">
                        <NumberStepper value={guildCount} onChange={handleGuildCountChange} />
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
                                                handleGuildNameChange(guild.id, e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <NumberStepper
                                            value={guild.playersCount}
                                            onChange={(newCount) =>
                                                handlePlayersCountChange(guild.id, newCount)
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
                    sessionId={id}
                />
            )}

            {simulationResult && (
                <GuildComponents guilds={simulationResult.data} />
            )}
        </div>
    );
};

export default StartSession;
