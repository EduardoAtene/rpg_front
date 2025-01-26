import React, { useState, useEffect } from "react";
import api from "../services/api";

const PlayerSelectionModal = ({ sessionId, onClose, onSave, fetchPlayers }) => {
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [searchAvailable, setSearchAvailable] = useState("");
    const [searchSelected, setSearchSelected] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPlayers, setIsFetchingPlayers] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        setIsFetchingPlayers(true);
        fetchPlayers()
            .then((response) => {
                if (response?.players && Array.isArray(response.players)) {
                    setAvailablePlayers(response.players);
                } else if (Array.isArray(response)) {
                    setAvailablePlayers(response);
                } else {
                    console.error("O retorno não é uma lista de jogadores válida:", response);
                    setAvailablePlayers([]);
                }
                setIsFetchingPlayers(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar jogadores:", error);
                setFetchError("Erro ao carregar a lista de jogadores. Tente novamente.");
                setIsFetchingPlayers(false);
            });
    }, [fetchPlayers]);

    const handleAddPlayer = (playerId) => {
        const player = availablePlayers.find((p) => p.id === playerId);
        setAvailablePlayers(availablePlayers.filter((p) => p.id !== playerId));
        setSelectedPlayers([...selectedPlayers, player]);
    };

    const handleRemovePlayer = (playerId) => {
        const player = selectedPlayers.find((p) => p.id === playerId);
        setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
        setAvailablePlayers([...availablePlayers, player]);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await api.associatePlayersToSession(sessionId, selectedPlayers.map((p) => p.id));
            alert("Jogadores adicionados à sessão com sucesso!");
            onSave(selectedPlayers);
            onClose();
        } catch (error) {
            console.error("Erro ao salvar jogadores na sessão:", error);
            alert("Erro ao adicionar jogadores à sessão. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAvailable = availablePlayers.filter((player) =>
        player.name.toLowerCase().includes(searchAvailable.toLowerCase())
    );

    const filteredSelected = selectedPlayers.filter((player) =>
        player.name.toLowerCase().includes(searchSelected.toLowerCase())
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
                                <div className="w-50 me-3">
                                    <h6>Jogadores Disponíveis</h6>
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
                                <div className="w-50">
                                    <h6>Jogadores Selecionados</h6>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Pesquisar jogadores..."
                                        value={searchSelected}
                                        onChange={(e) => setSearchSelected(e.target.value)}
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
                                            {filteredSelected.length > 0 ? (
                                                filteredSelected.map((player) => (
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
                                                        Nenhum jogador selecionado.
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
