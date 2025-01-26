import axios from 'axios';

// Configuração base do Axios
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Usa a URL do .env
});

// Funções relacionadas aos jogadores
const getPlayers = () => axiosInstance.get('/players');
const getPlayerClasses = () => axiosInstance.get('/players/classes');
const getPlayerById = (id) => axiosInstance.get(`/players/${id}`);
const createPlayer = (playerData) => axiosInstance.post('/players', playerData);
const updatePlayer = (id, playerData) => axiosInstance.put(`/players/${id}`, playerData);
const deletePlayer = (id) => axiosInstance.delete(`/players/${id}`);

// Funções relacionadas às sessões
const getSessions = () => axiosInstance.get('/sessions');
const getSessionById = (id) => axiosInstance.get(`/sessions/${id}`);
const createSession = (sessionData) => axiosInstance.post('/sessions', sessionData);
const updateSession = (id, sessionData) => axiosInstance.put(`/sessions/${id}`, sessionData);
const deleteSession = (id) => axiosInstance.delete(`/sessions/${id}`);

// Funções para associar/desassociar jogadores às sessões
const associatePlayersToSession = (sessionId, playerIds) =>
    axiosInstance.post(`/sessions/${sessionId}/players`, { player_ids: playerIds });
const unassociatePlayersFromSession = (sessionId, playerIds) =>
    axiosInstance.delete(`/sessions/${sessionId}/players`, { data: { player_ids: playerIds } });

// Função para simular guildas e confirmaaar
const simulateGuilds = (payload) => axiosInstance.post('/simulate-guilds', payload);
const confirmGuilds = (payload) => axiosInstance.post('/simulate-guilds/confirm', payload);



// Objeto consolidando todas as funções
const api = {
    getPlayers,
    getPlayerClasses,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    associatePlayersToSession,
    unassociatePlayersFromSession,
    simulateGuilds,
    confirmGuilds,
};

export default api;
