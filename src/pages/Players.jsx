import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { debounce } from "lodash";

const Players = () => {
    const [players, setPlayers] = useState([]); // Lista de jogadores inicializada como array vazio
    const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
    const navigate = useNavigate();

    // Carrega os jogadores ao montar o componente
    useEffect(() => {
        loadPlayers();
    }, []);

    const loadPlayers = debounce(async () => {
        try {
            const response = await api.getPlayers(); // Chamada da API
            if (response.data && Array.isArray(response.data.players)) {
                setPlayers(response.data.players); // Define a lista de jogadores
            } else {
                console.error("Resposta inesperada da API:", response.data);
                setPlayers([]); // Lista vazia em caso de erro
            }
        } catch (error) {
            console.error("Erro ao carregar jogadores:", error);
            alert("Erro ao carregar a lista de jogadores. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    }, 300); // Debounce de 300ms para evitar chamadas excessivas

    const handleRemovePlayer = async (id) => {
        if (window.confirm("Deseja realmente remover este jogador?")) {
            const previousPlayers = [...players]; // Backup dos jogadores
            try {
                setPlayers(players.filter((p) => p.id !== id)); // Atualiza a lista local
                await api.deletePlayer(id); // Chama a API para deletar o jogador
                alert("Jogador removido com sucesso!");
            } catch (error) {
                console.error("Erro ao remover jogador:", error);
                setPlayers(previousPlayers); // Restaura a lista local em caso de falha
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
                                <td>{player.class.name}</td> {/* Acessa o nome da classe */}
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
