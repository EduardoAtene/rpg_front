import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [alert, setAlert] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [modalType, setModalType] = useState(null); // 'start' or 'delete'
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
        setCurrentSessionId(id);
        setModalType('delete');
        setShowModal(true);
    };

    const confirmDeleteSession = () => {
        setShowModal(false);
        api.deleteSession(currentSessionId)
            .then(() => {
                setAlert({ type: "success", message: "Sessão excluída com sucesso!" });
                setSessions(sessions.filter((session) => session.id !== currentSessionId));
                setTimeout(() => setAlert(null), 3000);
            })
            .catch((error) => {
                console.error("Erro ao excluir sessão:", error);
                setAlert({ type: "danger", message: "Erro ao excluir a sessão. Tente novamente mais tarde." });
                setTimeout(() => setAlert(null), 3000);
            });
    };

    const handleStartSession = (id) => {
        setCurrentSessionId(id);
        setModalType('start');
        setShowModal(true);
    };

    const confirmStartSession = () => {
        setShowModal(false);
        navigate(`/sessions/start/${currentSessionId}`);
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
                        onClick={() => handleStartSession(session.id)}
                    >
                        Iniciar Sessão
                    </button>
                )}
                {(session.status === "in_progress" || session.status === "closed") && (
                    <button
                        className="btn btn-info btn-sm ms-2"
                        onClick={() => navigate(`/sessions/${session.id}/info`)}
                    >
                        Detalhes
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
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                >
                    Voltar para Home
                </button>
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

            {/* Modal de Confirmação */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modalType === 'start' ? 'Confirmar Início de Sessão' : 'Confirmar Exclusão de Sessão'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    {modalType === 'start'
                                        ? 'Você tem certeza que deseja iniciar esta sessão?'
                                        : 'Você tem certeza que deseja excluir esta sessão?'}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Não
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={modalType === 'start' ? confirmStartSession : confirmDeleteSession}
                                >
                                    Sim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sessions;
