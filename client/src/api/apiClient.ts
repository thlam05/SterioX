import axios from 'axios';

import { useAuthStore } from '@/stores/authStore';
import { PATHS } from '@/routes/paths';

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  success: boolean;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = PATHS.AUTH.LOGIN;
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);
