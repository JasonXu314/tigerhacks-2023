import axios from 'axios';

const api = axios.create({
	baseURL: process.env.API_URL,
	headers: {
		'ngrok-skip-browser-warning': 'abc',
		'Content-Type': 'application/x-www-form-urlencoded',
		Accept: 'application/json',
	},
});

export default api;
