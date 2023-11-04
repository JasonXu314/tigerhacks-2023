import axios from 'axios';

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        'ngrok-skip-browser-warning': 'abc'
    }
});

export default api;