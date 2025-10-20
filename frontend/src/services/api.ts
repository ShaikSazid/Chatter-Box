import axios from 'axios';
const api = axios.create({
// Hardcode the backend URL for stability in development environments.
baseURL: 'http://localhost:8080',
withCredentials: true,
});
export default api;