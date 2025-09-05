import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Essencial para cookies HttpOnly
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const csrf = async (): Promise<void> => {
  await api.get('/sanctum/csrf-cookie');
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;