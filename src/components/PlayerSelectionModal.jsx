import React, { useState, useEffect } from "react";
import api from "../services/api";

const PlayerSelectionModal = ({ sessionId, onClose, onSave }) => {
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [associatedPlayers, setAssociatedPlayers] = useState([]);
    const [searchAvailable, setSearchAvailable] = useState("");
    const [searchAssociated, setSearchAssociated] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPlayers, setIsFetchingPlayers] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const loadPlayers = async () => {
            try {
                setIsFetchingPlayers(true);

                const [availableResponse, associatedResponse] = await Promise.all([
                    api.getAssociatedPlayers(sessionId, 0), // Jogadores não associados
                    api.getAssociatedPlayers(sessionId, 1), // Jogadores associados
                ]);

                // Disponíveis: players_session de `associated=0`
                setAvailablePlayers(availableResponse.data?.players_session || []);
                // Associados: players_session de `associated=1`
                setAssociatedPlayers(associatedResponse.data?.players_session || []);
                setIsFetchingPlayers(false);
            } catch (error) {
                console.error("Erro ao buscar jogadores:", error);
                setFetchError("Erro ao carregar a lista de jogadores. Tente novamente.");
                setIsFetchingPlayers(false);
            }
        };

        loadPlayers();
    }, [sessionId]);

    const handleAddPlayer = (playerId) => {
        const player = availablePlayers.find((p) => p.id === playerId);
        setAvailablePlayers(availablePlayers.filter((p) => p.id !== playerId));
        setAssociatedPlayers([...associatedPlayers, player]);
    };

    const handleRemovePlayer = (playerId) => {
        const player = associatedPlayers.find((p) => p.id === playerId);
        setAssociatedPlayers(associatedPlayers.filter((p) => p.id !== playerId));
        setAvailablePlayers([...availablePlayers, player]);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await api.associatePlayersToSession(
                sessionId,
                associatedPlayers.map((p) => p.id)
            );
            alert("Jogadores associados à sessão com sucesso!");
            onSave(associatedPlayers);
            onClose();
        } catch (error) {
            console.error("Erro ao salvar jogadores na sessão:", error);
            alert("Erro ao associar jogadores à sessão. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAvailable = availablePlayers.filter((player) =>
        player.name?.toLowerCase().includes(searchAvailable.toLowerCase())
    );

    const filteredAssociated = associatedPlayers.filter((player) =>
        player.name?.toLowerCase().includes(searchAssociated.toLowerCase())
    );

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Seleção de Jogadores</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body d-flex">
                        {isFetchingPlayers ? (
                            <div className="w-100 text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Carregando jogadores...</span>
                                </div>
                                <p>Carregando jogadores...</p>
                            </div>
                        ) : fetchError ? (
                            <div className="w-100 text-center text-danger">
                                <p>{fetchError}</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => window.location.reload()}
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Jogadores Não Associados */}
                                <div className="w-50 me-3">
                                    <h6>Jogadores Não Associados</h6>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Pesquisar jogadores..."
                                        value={searchAvailable}
                                        onChange={(e) => setSearchAvailable(e.target.value)}
                                    />
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Classe</th>
                                                <th>XP</th>
                                                <th>Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAvailable.length > 0 ? (
                                                filteredAvailable.map((player) => (
                                                    <tr key={player.id}>
                                                        <td>{player.name}</td>
                                                        <td>{player.class?.name || "Sem classe"}</td>
                                                        <td>{player.xp || 0}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => handleAddPlayer(player.id)}
                                                                disabled={isLoading}
                                                            >
                                                                ►
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted">
                                                        Nenhum jogador encontrado.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Jogadores Associados */}
                                <div className="w-50">
                                    <h6>Jogadores Associados</h6>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Pesquisar jogadores..."
                                        value={searchAssociated}
                                        onChange={(e) => setSearchAssociated(e.target.value)}
                                    />
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Ação</th>
                                                <th>Nome</th>
                                                <th>Classe</th>
                                                <th>XP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAssociated.length > 0 ? (
                                                filteredAssociated.map((player) => (
                                                    <tr key={player.id}>
                                                        <td>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleRemovePlayer(player.id)}
                                                                disabled={isLoading}
                                                            >
                                                                ◄
                                                            </button>
                                                        </td>
                                                        <td>{player.name}</td>
                                                        <td>{player.class?.name || "Sem classe"}</td>
                                                        <td>{player.xp || 0}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted">
                                                        Nenhum jogador associado.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={isLoading || isFetchingPlayers}
                        >
                            {isLoading ? (
                                <span>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Salvando...
                                </span>
                            ) : (
                                "Salvar"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerSelectionModal;
