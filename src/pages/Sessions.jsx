import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.alert) {
            setAlert(location.state.alert);
            setTimeout(() => setAlert(null), 3000);
        }

        api.getSessions()
            .then((response) => {
                if (Array.isArray(response.data.sessions)) {
                    setSessions(response.data.sessions);
                } else {
                    console.error("Estrutura inesperada no retorno da API:", response.data);
                    setSessions([]);
                }
            })
            .catch((error) => {
                console.error("Erro ao carregar sessões:", error);
                setAlert({ type: "danger", message: "Erro ao carregar as sessões. Tente novamente mais tarde." });
                setTimeout(() => setAlert(null), 3000);
            });
    }, [location.state]);

    const handleDeleteSession = (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta sessão?")) {
            api.deleteSession(id)
                .then(() => {
                    setAlert({ type: "success", message: "Sessão excluída com sucesso!" });
                    setSessions(sessions.filter((session) => session.id !== id));
                    setTimeout(() => setAlert(null), 3000);
                })
                .catch((error) => {
                    console.error("Erro ao excluir sessão:", error);
                    setAlert({ type: "danger", message: "Erro ao excluir a sessão. Tente novamente mais tarde." });
                    setTimeout(() => setAlert(null), 3000);
                });
        }
    };

    const getActions = (session) => {
        return (
            <>
                <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => navigate(`/sessions/edit/${session.id}`)}
                >
                    Editar
                </button>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteSession(session.id)}
                >
                    Excluir
                </button>
                {session.status === "waiting" && (
                    <button
                        className="btn btn-warning btn-sm ms-2"
                        onClick={() => navigate(`/sessions/start/${session.id}`)}
                    >
                        Iniciar Sessão
                    </button>
                )}
                {session.status === "finished" && (
                    <button
                        className="btn btn-info btn-sm ms-2"
                        onClick={() => navigate(`/sessions/view/${session.id}`)}
                    >
                        Visualizar
                    </button>
                )}
            </>
        );
    };

    const handleAlertClose = () => {
        setAlert(null);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Listagem de Sessões</h1>
            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" onClick={handleAlertClose}></button>
                </div>
            )}
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
                        <th>Data</th>
                        <th>Status</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session) => (
                        <tr key={session.id}>
                            <td>{session.name}</td>
                            <td>{session.date_session.split(" ")[0]}</td>
                            <td>{session.status}</td>
                            <td>
                                <div
                                    title={session.description}
                                    style={{ cursor: "pointer" }}
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                >
                                    {session.description?.length > 20
                                        ? `${session.description.substring(0, 20)}...`
                                        : session.description}
                                </div>
                            </td>
                            <td>{getActions(session)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sessions;
