import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://techpines-test.onrender.com/api';
const TOKEN_KEY = "access_token"; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Essencial para cookies HttpOnly
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
  }
}

// Ao iniciar o app, reativa o token salvo (auto-login)
const saved = localStorage.getItem(TOKEN_KEY);
if (saved) setAuthToken(saved);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      //setAuthToken(); // limpa token
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;