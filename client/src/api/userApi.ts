import { api, type ApiResponse } from "@/api/apiClient";

export type UserResponse = {
  id: string;
  username: string;
  email: string;
  avatarImageUrl: string;
  roles: string[];
};

export type UserRequest = {
  username: string;
  email: string;
  avatarImageUrl?: string;
  roles?: string[];
};

export const userApi = {
  async getUsers() {
    const response = await api.get<ApiResponse<UserResponse[]>>("/users");
    return response.data.data;
  },

  async createUser(payload: UserRequest) {
    const response = await api.post<ApiResponse<UserResponse>>("/users", payload);
    return response.data.data;
  },

  async getMe() {
    const response = await api.get<ApiResponse<UserResponse>>("/users/me");
    return response.data.data;
  },

  async getUserById(id: string) {
    const response = await api.get<ApiResponse<UserResponse>>(`/users/${id}`);
    return response.data.data;
  },

  async updateUser(id: string, payload: UserRequest) {
    const response = await api.put<ApiResponse<UserResponse>>(`/users/${id}`, payload);
    return response.data.data;
  },

  async deleteUser(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/user/${id}`);
    return response.data;
  },
};
