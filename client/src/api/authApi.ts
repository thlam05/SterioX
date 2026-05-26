import { api, type ApiResponse } from "@/api/apiClient";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
  tokenType: string;
};

export const authApi = {
  async login(payload: LoginRequest) {
    const response = await api.post<ApiResponse<TokenResponse>>("/auth/login", payload);
    return response.data.data;
  },

  async register(payload: RegisterRequest) {
    const response = await api.post<ApiResponse<TokenResponse>>("/auth/register", payload);
    return response.data.data;
  },

  async logout(token: string) {
    const response = await api.post<ApiResponse<null>>("/auth/logout", { token });
    return response.data;
  },

  async refresh(token: string) {
    const response = await api.post<ApiResponse<TokenResponse>>("/auth/refresh", { token });
    return response.data.data;
  },
};
