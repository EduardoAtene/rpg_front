import React, { useState, useEffect } from "react";

const PlayerSelectionModal = ({ onClose, onSave, fetchPlayers }) => {
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [searchAvailable, setSearchAvailable] = useState("");
    const [searchSelected, setSearchSelected] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPlayers().then(setAvailablePlayers);
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

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            onSave(selectedPlayers);
            setIsLoading(false);
            onClose();
        }, 1500);
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
                        <div className="w-50 me-3">
                            <h6>Disponíveis</h6>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Pesquisar jogadores..."
                                value={searchAvailable}
                                onChange={(e) => setSearchAvailable(e.target.value)}
                            />
                            <ul
                                className="list-group"
                                style={{ maxHeight: "300px", overflowY: "auto" }}
                            >
                                {filteredAvailable.map((player) => (
                                    <li
                                        key={player.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {player.name} - {player.class}
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleAddPlayer(player.id)}
                                        >
                                            ➡️
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-50">
                            <h6>Selecionados</h6>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Pesquisar jogadores..."
                                value={searchSelected}
                                onChange={(e) => setSearchSelected(e.target.value)}
                            />
                            <ul
                                className="list-group"
                                style={{ maxHeight: "300px", overflowY: "auto" }}
                            >
                                {filteredSelected.map((player) => (
                                    <li
                                        key={player.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {player.name} - {player.class}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemovePlayer(player.id)}
                                        >
                                            ⬅️
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={isLoading}
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
