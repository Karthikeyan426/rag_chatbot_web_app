import axios from "axios";
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

api.interceptors.request.use((config) => {
    console.log(config.baseURL)
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;