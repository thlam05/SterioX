import { api, type ApiResponse } from "@/api/apiClient";
import type { CreateStreamKeyRequest, CreateStreamRequest, LivestreamLikeRequest, LivestreamLikeResponse, LivestreamLikeStatusResponse, StreamKeyResponse, StreamResponse } from "@/types/streamType";

export const streamKeyApi = {
  async getStreamKey(userId: string) {
    const response = await api.get<ApiResponse<StreamKeyResponse>>(`/stream-keys/user/${userId}`);
    return response.data.data;
  },

  async createStreamKey(createRequest: CreateStreamKeyRequest) {
    const response = await api.post<ApiResponse<StreamKeyResponse>>(`/stream-keys`, createRequest);
    return response.data.data;
  }
};


export const streamApi = {
  async createStream(createRequest: CreateStreamRequest) {
    const response = await api.post<ApiResponse<StreamResponse>>(`/streams`, createRequest, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data;
  },
  async getStreamOnlineOfUSer(userId: string) {
    const response = await api.get<ApiResponse<StreamResponse>>(`/streams/user/${userId}`)
    return response.data.data;
  },
  async getStreamById(id: string) {
    const response = await api.get<ApiResponse<StreamResponse>>(`/streams/${id}`);
    return response.data.data;
  },
  async getTopStream() {
    const response = await api.get<ApiResponse<StreamResponse[]>>(`/streams/top`);
    return response.data.data;
  },
  async startStreamById(id: string) {
    const response = await api.patch<ApiResponse<StreamResponse>>(`/streams/start/${id}`);
    return response.data.data;
  },
  async stopStreamById(id: string) {
    const response = await api.patch<ApiResponse<StreamResponse>>(`/streams/stop/${id}`);
    return response.data.data;
  },
  async likeStreamById(id: String, payload: LivestreamLikeRequest) {
    const response = await api.patch<ApiResponse<LivestreamLikeResponse>>(`/streams/like/${id}`, payload);
    return response.data.data;
  },
  async checkStatusLikedStream(id: string) {
    const response = await api.get<ApiResponse<LivestreamLikeStatusResponse>>(`/streams/like-status/${id}`);
    return response.data.data;
  }
} 