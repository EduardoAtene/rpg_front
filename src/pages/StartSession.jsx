import React, { useState } from "react";
import PlayerSelectionModal from "../components/PlayerSelectionModal";
import { api } from "../services/api";

const StartSession = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSavePlayers = (players) => {
        setSelectedPlayers(players);
    };

    const handleSubmit = () => {
        console.log("Sessão iniciada com os jogadores:", selectedPlayers);
        alert("Sessão iniciada com sucesso!");
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Iniciar Sessão</h1>
            <div className="mb-4">
                <h6>Jogadores Selecionados:</h6>
                <ul>
                    {selectedPlayers.map((player) => (
                        <li key={player.id}>
                            {player.name} - {player.class}
                        </li>
                    ))}
                </ul>
                <button className="btn btn-primary mt-3" onClick={handleOpenModal}>
                    Selecionar Jogadores
                </button>
            </div>
            <div className="d-flex justify-content-between mt-4">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => alert("Voltando para a listagem de sessões")}
                >
                    Voltar
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={selectedPlayers.length === 0}
                >
                    Iniciar Sessão
                </button>
            </div>
            {showModal && (
                <PlayerSelectionModal
                    fetchPlayers={api.getAvailablePlayers}
                    onClose={handleCloseModal}
                    onSave={handleSavePlayers}
                />
            )}
        </div>
    );
};

export default StartSession;
