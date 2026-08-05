import axios from "axios";

import { useAuthStore } from "@/stores/authStore";

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  success: boolean;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
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
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);
