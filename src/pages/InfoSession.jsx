import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const InfoSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sessionDetails, setSessionDetails] = useState(null);
    const [guilds, setGuilds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const fetchSessionDetails = async () => {
            try {
                // Requisição para obter detalhes da sessão
                const sessionResponse = await api.getSessionById(id);
                const sessionData = sessionResponse.data?.session;

                setSessionDetails(sessionData);

                // Se o status não for "waiting", buscar guildas da sessão
                if (sessionData?.status !== "waiting") {
                    const guildsResponse = await api.getGuildsBySession(id);
                    setGuilds(guildsResponse.data?.guilds || []);
                }
            } catch (err) {
                console.error("Erro ao buscar detalhes da sessão:", err);
                setError("Erro ao carregar os detalhes da sessão. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessionDetails();
    }, [id]);

    const handleCloseSession = async () => {
        setIsClosing(true);
        try {
            await api.closeSession(id); // Chama o endpoint para fechar a sessão
            alert("Sessão fechada com sucesso!");
            navigate("/sessions"); // Redireciona para a lista de sessões
        } catch (err) {
            console.error("Erro ao fechar a sessão:", err);
            alert("Erro ao fechar a sessão. Tente novamente.");
        } finally {
            setIsClosing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p>Carregando detalhes da sessão...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-5">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-secondary" onClick={() => navigate("/sessions")}>
                    Voltar
                </button>
            </div>
        );
    }

    if (!sessionDetails) {
        return (
            <div className="text-center mt-5">
                <p className="text-muted">Nenhuma informação disponível para esta sessão.</p>
                <button className="btn btn-secondary" onClick={() => navigate("/sessions")}>
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-secondary" onClick={() => navigate("/sessions")}>
                    Voltar
                </button>
                {sessionDetails.status === "in_progress" && (
                    <button
                        className="btn btn-danger"
                        onClick={handleCloseSession}
                        disabled={isClosing}
                    >
                        {isClosing ? "Fechando..." : "Fechar Sessão"}
                    </button>
                )}
            </div>
            <h1 className="mb-4 text-center">Detalhes da Sessão</h1>

            {/* Detalhes da Sessão */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Nome da Sessão: {sessionDetails.name}</h5>
                    <p className="card-text">
                        <strong>Status:</strong> {sessionDetails.status}
                    </p>
                    <p className="card-text">
                        <strong>Data:</strong> {sessionDetails.date_session}
                    </p>
                    <p className="card-text">
                        <strong>Descrição:</strong> {sessionDetails.description}
                    </p>
                </div>
            </div>

            {/* Guildas */}
            {sessionDetails.status !== "waiting" && (
                <>
                    <h3 className="mb-3">Guildas</h3>
                    {guilds.length > 0 ? (
                        guilds.map((guild, index) => (
                            <div key={index} className="card mb-3">
                                <div className="card-header">
                                    <h5>{guild.guild_name}</h5>
                                </div>
                                <div className="card-body">
                                    <h6>Jogadores</h6>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Classe</th>
                                                <th>XP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guild.players.map((player, playerIndex) => (
                                                <tr key={playerIndex}>
                                                    <td>{player.name}</td>
                                                    <td>{player.class?.name || "Sem classe"}</td>
                                                    <td>{player.xp}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">Nenhuma guilda encontrada para esta sessão.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default InfoSession;
