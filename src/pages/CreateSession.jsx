import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const CreateEditSession = () => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            api.getSessionById(id)
                .then((response) => {
                    const session = response.data.session;
                    if (session) {
                        setName(session.name);
                        const formattedDate = session.date_session.split(" ")[0].split("/").reverse().join("-");
                        setDate(formattedDate);
                        setDescription(session.description);
                    }
                })
                .catch((error) => {
                    setAlert({ type: "danger", message: "Erro ao carregar a sessão. Tente novamente mais tarde." });
                    console.error("Erro ao carregar a sessão:", error);
                })
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    const handleDateBlur = () => {
        const today = new Date().toISOString().split("T")[0];
        if (date && date < today) {
            setAlert({
                type: "warning",
                message: "A data está no passado, mas ainda pode ser salva caso deseje continuar.",
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const sessionData = { name, date_session: date, description };

        if (id) {
            api.updateSession(id, sessionData)
                .then(() => {
                    navigate("/sessions", { state: { alert: { type: "success", message: "Sessão atualizada com sucesso!" } } });
                })
                .catch((error) => {
                    setAlert({ type: "danger", message: "Erro ao atualizar a sessão. Tente novamente mais tarde." });
                    console.error("Erro ao atualizar a sessão:", error);
                })
                .finally(() => setIsLoading(false));
        } else {
            api.createSession(sessionData)
                .then(() => {
                    navigate("/sessions", { state: { alert: { type: "success", message: "Sessão criada com sucesso!" } } });
                })
                .catch((error) => {
                    setAlert({ type: "danger", message: "Erro ao criar a sessão. Tente novamente mais tarde." });
                    console.error("Erro ao criar a sessão:", error);
                })
                .finally(() => setIsLoading(false));
        }
    };

    const handleDelete = () => {
        if (window.confirm("Deseja realmente excluir esta sessão?")) {
            setIsLoading(true);
            api.deleteSession(id)
                .then(() => {
                    navigate("/sessions", { state: { alert: { type: "success", message: "Sessão excluída com sucesso!" } } });
                })
                .catch((error) => {
                    setAlert({ type: "danger", message: "Erro ao excluir a sessão. Tente novamente mais tarde." });
                    console.error("Erro ao excluir a sessão:", error);
                })
                .finally(() => setIsLoading(false));
        }
    };

    const handleAlertClose = () => {
        setAlert(null);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">{id ? "Editar Sessão" : "Criar Sessão"}</h1>
            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" onClick={handleAlertClose}></button>
                </div>
            )}
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Carregando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Nome da Sessão
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">
                            Data da Sessão
                        </label>
                        <input
                            type="date"
                            id="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onBlur={handleDateBlur}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Descrição
                        </label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/sessions")}
                        >
                            Voltar
                        </button>
                        <div>
                            {id && (
                                <button
                                    type="button"
                                    className="btn btn-danger me-2"
                                    onClick={handleDelete}
                                >
                                    Excluir Sessão
                                </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                                {id ? "Salvar Sessão" : "Criar Sessão"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CreateEditSession;