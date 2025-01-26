import React from "react";

const GuildComponents = ({ guilds }) => {
    if (!guilds || guilds.length === 0) {
        return <p className="text-center">Nenhuma guilda gerada.</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Resultados das Guildas</h1>
            {guilds.map((guild, index) => (
                <div key={index} className="mb-5">
                    <h3 className="mb-3">Guilda: {guild.guild_name}</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Jogador</th>
                                <th>Classe</th>
                                <th>XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guild.players.map((player, playerIndex) => (
                                <tr key={playerIndex}>
                                    <td>{player.name}</td>
                                    <td>{player.class.name}</td>
                                    <td>{player.xp}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2"><strong>Total de XP:</strong></td>
                                <td><strong>{guild.total_xp}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                    {guild.missing_classes && guild.missing_classes.length > 0 && (
                        <div className="alert alert-warning mt-3" role="alert">
                            <strong>Classes Faltantes:</strong> {guild.missing_classes.join(", ")}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GuildComponents;
