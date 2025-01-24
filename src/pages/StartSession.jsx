import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlayerSelectionModal from "../components/PlayerSelectionModal";
import api from "../services/api";

const StartSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            api.getSessionById(id).then((data) => {
                setSession(data);
                setSelectedPlayers(data.participants || []);
                setIsLoading(false);
            });
        }
    }, [id]);

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
        if (id) {
            alert(`Sessão "${session.name}" atualizada com sucesso!`);
        } else {
            console.log("Sessão criada com os jogadores:", selectedPlayers);
            alert("Sessão criada com sucesso!");
        }
        navigate("/sessions");
    };

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Carregando informações da sessão...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">{id ? "Visualizar/Editar Sessão" : "Criar Sessão"}</h1>
            {session && (
                <div className="mb-4">
                    <p><strong>Nome da Sessão:</strong> {session.name}</p>
                    <p><strong>Status:</strong> {session.status}</p>
                    <p><strong>Data de Início:</strong> {session.startDate}</p>
                    <p><strong>Descrição:</strong> {session.description || "Nenhuma descrição disponível."}</p>
                </div>
            )}
            <div className="mb-4">
                <h6>Jogadores Selecionados:</h6>
                <ul>
                    {selectedPlayers.map((player) => (
                        <li key={player.id}>
                            {player.name} - {player.class}
                        </li>
                    ))}
                </ul>
                {!id && (
                    <button className="btn btn-primary mt-3" onClick={handleOpenModal}>
                        Selecionar Jogadores
                    </button>
                )}
            </div>
            <div className="d-flex justify-content-between mt-4">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/sessions")}
                >
                    Voltar
                </button>
                {!id && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={selectedPlayers.length === 0}
                    >
                        Iniciar Sessão
                    </button>
                )}
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
