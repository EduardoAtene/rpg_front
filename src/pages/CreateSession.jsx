import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateSession = () => {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            // Simula carregamento de dados da sessão
            setTimeout(() => {
                setName("Sessão 1");
                setStartDate("2025-01-01");
                setIsLoading(false);
            }, 1000);
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (id) {
                console.log("Sessão editada:", { id, name, startDate });
                alert("Sessão editada com sucesso!");
                
            } else {
                console.log("Nova sessão criada:", { name, startDate });
                alert("Sessão criada com sucesso!");
            }
            setIsLoading(false);
            navigate("/sessions");
        }, 1500);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{id ? "Editar Jogador" : "Criar Jogador"}</h1>
                <button className="btn btn-secondary" onClick={() => navigate("/players")}>
                    Voltar para Listagem
                </button>
            </div>
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
                    <button type="submit" className="btn btn-primary">
                        {id ? "Salvar Sessão" : "Criar Sessão"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default CreateSession;
