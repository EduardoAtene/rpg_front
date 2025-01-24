import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const CreatePlayer = () => {
    const [name, setName] = useState("");
    const [xp, setXp] = useState(1);
    const [playerClass, setPlayerClass] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            api.getPlayerById(parseInt(id, 10)).then((response) => {
                const player = response.data.player; // Ajustado para acessar o campo "player" no JSON
                if (player) {
                    setName(player.name);
                    setXp(player.xp);
                    setPlayerClass(player.class.name); // Ajuste para acessar o nome da classe corretamente
                }
                setIsLoading(false);
            }).catch((error) => {
                console.error("Erro ao carregar jogador:", error);
                alert("Erro ao carregar os dados do jogador. Tente novamente mais tarde.");
                setIsLoading(false);
            });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const playerData = { name, xp, class: { name: playerClass } }; // Envia a classe no formato correto

        if (id) {
            api.updatePlayer(parseInt(id, 10), playerData).then(() => {
                alert("Jogador atualizado com sucesso!");
                navigate("/players");
            }).catch((error) => {
                console.error("Erro ao atualizar jogador:", error);
                alert("Erro ao atualizar o jogador. Tente novamente mais tarde.");
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            api.createPlayer(playerData).then(() => {
                alert("Jogador criado com sucesso!");
                navigate("/players");
            }).catch((error) => {
                console.error("Erro ao criar jogador:", error);
                alert("Erro ao criar o jogador. Tente novamente mais tarde.");
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };

    const handleRemove = () => {
        if (window.confirm("Deseja realmente remover este jogador?")) {
            api.deletePlayer(parseInt(id, 10)).then(() => {
                alert("Jogador removido com sucesso!");
                navigate("/players");
            }).catch((error) => {
                console.error("Erro ao remover jogador:", error);
                alert("Erro ao remover o jogador. Tente novamente mais tarde.");
            });
        }
    };

    const handleXpChange = (e) => {
        const value = Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1));
        setXp(value);
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
                        <label htmlFor="name" className="form-label">
                            Nome do Jogador
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
                        <label htmlFor="class" className="form-label">
                            Classe do Jogador
                        </label>
                        <select
                            id="class"
                            className="form-select"
                            value={playerClass}
                            onChange={(e) => setPlayerClass(e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecione uma classe</option>
                            <option value="Clérigo">Clérigo</option>
                            <option value="Guerreiro">Guerreiro</option>
                            <option value="Mago">Mago</option>
                            <option value="Arqueiro">Arqueiro</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="xp" className="form-label">
                            XP do Jogador (1-100)
                        </label>
                        <input
                            type="number"
                            id="xp"
                            className="form-control"
                            value={xp}
                            onChange={handleXpChange}
                            min="1"
                            max="100"
                            required
                        />
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