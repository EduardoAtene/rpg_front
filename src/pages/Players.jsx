import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { debounce } from "lodash";

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    
    useEffect(() => {
        loadPlayers();
    }, []);

    const loadPlayers = debounce(async () => {
        try {
            const response = await api.getPlayers();
            if (response.data && Array.isArray(response.data.players)) {
                setPlayers(response.data.players);
            } else {
                console.error("Resposta inesperada da API:", response.data);
                setPlayers([]);
            }
        } catch (error) {
            console.error("Erro ao carregar jogadores:", error);
            alert("Erro ao carregar a lista de jogadores. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    }, 300);

    const handleRemovePlayer = async (id) => {
        if (window.confirm("Deseja realmente remover este jogador?")) {
            const previousPlayers = [...players];
            try {
                setPlayers(players.filter((p) => p.id !== id));
                await api.deletePlayer(id);
                alert("Jogador removido com sucesso!");
            } catch (error) {
                console.error("Erro ao remover jogador:", error);
                setPlayers(previousPlayers);
                alert("Erro ao remover o jogador. Tente novamente.");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Carregando jogadores...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Listagem de Jogadores</h1>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                >
                    Voltar para Home
                </button>
                <button
                    className="btn btn-success"
                    onClick={() => navigate("/players/create")}
                >
                    Criar Jogador
                </button>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Classe</th>
                        <th>XP</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {players.length > 0 ? (
                        players.map((player) => (
                            <tr key={player.id}>
                                <td>{player.name}</td>
                                <td>{player.class.name}</td>
                                <td>{player.xp}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => navigate(`/players/edit/${player.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemovePlayer(player.id)}
                                    >
                                        Remover
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">Nenhum jogador encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Players;
