import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.getSessions().then(setSessions);
    }, []);

    const getActions = (session) => {
        if (session.status === "Não iniciada") {
            return (
                <>
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
                </>
            );
        }
        if (session.status === "Em andamento") {
            return (
                <>
                    <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/sessions/edit/${session.id}`)}
                    >
                        Editar
                    </button>
                    <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => navigate(`/sessions/start/${session.id}`)}
                    >
                        Retomar Sessão
                    </button>
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => alert(`Sessão ${session.name} finalizada!`)}
                    >
                        Finalizar Sessão
                    </button>
                </>
            );
        }
        if (session.status === "Concluída") {
            return <span className="text-muted">Sem ações</span>;
        }
        return null;
    };

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
                            <td>{getActions(session)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sessions;
