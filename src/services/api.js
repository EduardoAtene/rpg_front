let playersMock = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Jogador ${index + 1}`,
    class: ["Clérigo", "Guerreiro", "Mago", "Arqueiro"][
        Math.floor(Math.random() * 4)
    ],
    xp: Math.floor(Math.random() * 100),
}));

const sessionsMock = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Sessão ${index + 1}`,
    startDate: `2025-01-${String(index + 1).padStart(2, "0")}`,
    status: ["Não iniciada", "Em andamento", "Concluída"][
        Math.floor(Math.random() * 3)
    ],
}));

export const api = {
    getPlayers: () => Promise.resolve([...playersMock]),
    addPlayer: (player) => {
        playersMock = [...playersMock, { id: playersMock.length + 1, ...player }];
        return Promise.resolve(playersMock[playersMock.length - 1]);
    },
    getSessions: () => Promise.resolve(sessionsMock),
    getSessionById: (id) => Promise.resolve(sessionsMock.find((s) => s.id === id)),
    getAvailablePlayers: () => Promise.resolve([...playersMock]),
};
