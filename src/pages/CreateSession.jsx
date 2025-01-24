import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

const CreateSession = () => {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            api.getSessionById(parseInt(id, 10)).then((session) => {
                if (session) {
                    setName(session.name);
                    setStartDate(session.startDate);
                    setStatus(session.status);
                }
                setIsLoading(false);
            });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (id) {
                console.log("Sessão editada:", { id, name, startDate, status });
                alert("Sessão editada com sucesso!");
            } else {
                console.log("Nova sessão criada:", { name, startDate, status: "Não iniciada" });
                alert("Sessão criada com sucesso!");
            }
            setIsLoading(false);
            navigate("/sessions");
        }, 1500);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">{id ? "Editar Sessão" : "Criar Sessão"}</h1>
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
                        <label htmlFor="startDate" className="form-label">
                            Data de Início
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    {id && (
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <input
                                type="text"
                                id="status"
                                className="form-control"
                                value={status}
                                readOnly
                            />
                        </div>
                    )}
                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/sessions")}
                        >
                            Voltar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {id ? "Salvar Sessão" : "Criar Sessão"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CreateSession;