import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api", // Substitua pelo endereço do seu backend
});

export default api;
