import axios from 'axios';

// This makes the assumption that the backend is served on the same host
// as the frontend, but on port 8080. This is more robust for
// development environments where the host might be 'localhost', '127.0.0.1',
// or a specific IP address in a containerized setup.
const backendPort = 8080;
const backendUrl = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

export default api;
