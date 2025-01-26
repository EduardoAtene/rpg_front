import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const CreatePlayer = () => {
    const [name, setName] = useState("");
    const [xp, setXp] = useState(1);
    const [playerClassId, setPlayerClassId] = useState("");
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [xpError, setXpError] = useState(""); // Armazena o erro de validação do XP
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const classesResponse = await api.getPlayerClasses();
                setClasses(classesResponse.data?.player_classes || []);

                if (id) {
                    const playerResponse = await api.getPlayerById(parseInt(id, 10));
                    const player = playerResponse.data?.player;

                    if (player) {
                        setName(player.name);
                        setXp(player.xp);
                        setPlayerClassId(player.class.id);
                    }
                }
            } catch (error) {
                alert("Erro ao carregar os dados. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (xp < 1 || xp > 100 || !Number.isInteger(xp)) {
            setXpError("O XP deve ser um número inteiro entre 1 e 100.");
            return;
        }

        setXpError("");
        setIsLoading(true);

        const playerData = { name, xp, player_class_id: playerClassId };

        try {
            if (id) {
                await api.updatePlayer(parseInt(id, 10), playerData);
                alert("Jogador atualizado com sucesso!");
            } else {
                await api.createPlayer(playerData);
                alert("Jogador criado com sucesso!");
            }
            navigate("/players");
        } catch (error) {
            alert("Erro ao salvar o jogador. Tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async () => {
        if (window.confirm("Deseja realmente remover este jogador?")) {
            try {
                await api.deletePlayer(parseInt(id, 10));
                alert("Jogador removido com sucesso!");
                navigate("/players");
            } catch (error) {
                alert("Erro ao remover o jogador. Tente novamente mais tarde.");
            }
        }
    };

    const handleXpChange = (e) => {
        const value = e.target.value;
        setXp(value);

        if (!Number.isInteger(Number(value))) {
            setXpError("O XP deve ser um número inteiro.");
        } else if (value < 1) {
            setXpError("O XP não pode ser menor que 1.");
        } else if (value > 100) {
            setXpError("O XP não pode ser maior que 100.");
        } else {
            setXpError("");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">{id ? "Editar Jogador" : "Criar Jogador"}</h1>
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
                        <label htmlFor="name" className="form-label">Nome do Jogador</label>
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
                        <label htmlFor="class" className="form-label">Classe do Jogador</label>
                        <select
                            id="class"
                            className="form-select"
                            value={playerClassId}
                            onChange={(e) => setPlayerClassId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecione uma classe</option>
                            {classes.map((playerClass) => (
                                <option key={playerClass.id} value={playerClass.id}>
                                    {playerClass.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="xp" className="form-label">XP do Jogador</label>
                        <input
                            type="number"
                            id="xp"
                            className="form-control"
                            value={xp}
                            onChange={handleXpChange}
                            required
                        />
                        {xpError && <div className="text-danger mt-1">{xpError}</div>}
                    </div>
                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/players")}
                        >
                            Voltar
                        </button>
                        <div>
                            {id && (
                                <button
                                    type="button"
                                    className="btn btn-danger me-2"
                                    onClick={handleRemove}
                                >
                                    Remover
                                </button>
                            )}
                            <button type="submit" className="btn btn-primary">
                                {id ? "Salvar Jogador" : "Criar Jogador"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CreatePlayer;
