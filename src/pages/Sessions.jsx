import React from "react";
import { useNavigate } from "react-router-dom";

const Sessions = () => {
    const navigate = useNavigate();

    const sessions = [
        { id: 1, name: "Sessão 1", startDate: "2025-01-01", status: "Pendente" },
        { id: 2, name: "Sessão 2", startDate: "2025-02-01", status: "Concluída" },
    ];

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Listagem de Sessões</h1>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Sessões</h2>
                <button
                    className="btn btn-success"
                    onClick={() => navigate("/sessions/create")}
                >
                    Criar Sessão
                </button>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data de Início</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session) => (
                        <tr key={session.id}>
                            <td>{session.name}</td>
                            <td>{session.startDate}</td>
                            <td>{session.status}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => navigate(`/sessions/edit/${session.id}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => navigate(`/sessions/start/${session.id}`)}
                                >
                                    Iniciar Sessão
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sessions;
