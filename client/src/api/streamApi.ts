import { api, type ApiResponse } from "@/api/apiClient";

export type StreamResponse = {
  streamKey: string;
  userId: string;
  streamUrl: string;
  isActive: boolean;
  updatedAt: Date;
};

export type CreateStreamKeyRequest = {
  userId: string;
  isActive: boolean
};

export const streamApi = {
  async getStreamKey(userId: string) {
    const response = await api.get<ApiResponse<StreamResponse>>(`/stream-keys/user/${userId}`);
    return response.data.data;
  },

  async createStreamKey(createRequest: CreateStreamKeyRequest) {
    const response = await api.post<ApiResponse<StreamResponse>>(`/stream-keys`, createRequest);
    return response.data.data;
  }
};
