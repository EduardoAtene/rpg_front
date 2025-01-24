import React from "react";
import { useNavigate } from "react-router-dom";

const Players = () => {
    const navigate = useNavigate();

    const players = [
        { id: 1, name: "Eduardo Atene", xp: 15, class: "Arqueiro" },
        { id: 2, name: "João Silva", xp: 20, class: "Mago" },
    ];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Listagem de Jogadores</h1>
                <button className="btn btn-secondary" onClick={() => navigate("/")}>
                    Voltar para Home
                </button>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Jogadores</h2>
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
                        <th>XP</th>
                        <th>Classe</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => (
                        <tr key={player.id}>
                            <td>{player.name}</td>
                            <td>{player.xp}</td>
                            <td>{player.class}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => navigate(`/players/edit/${player.id}`)}
                                >
                                    Editar
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
