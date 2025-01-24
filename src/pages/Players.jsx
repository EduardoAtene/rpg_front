import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Players = () => {
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.getPlayers().then(setPlayers);
    }, []);

    const handleRemovePlayer = (id) => {
        if (window.confirm("Deseja realmente remover este jogador?")) {
            api.deletePlayer(id).then(() => {
                setPlayers(players.filter((p) => p.id !== id));
                alert("Jogador removido com sucesso!");
            });
        }
    };

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
                    {players.map((player) => (
                        <tr key={player.id}>
                            <td>{player.name}</td>
                            <td>{player.class}</td>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Players;
