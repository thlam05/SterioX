import { api, type ApiResponse } from "@/api/apiClient";

export type StreamKeyResponse = {
  streamKey: string;
  userId: string;
  streamUrl: string;
  isActive: boolean;
  updatedAt: Date;
};

export type StreamResponse = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  thumbnail: string;
  latency: string;
  dvr: boolean;
  vod: boolean;
  playUrl: string;
  isActive: boolean;
  currentViewers: number;
  maxViewers: number;
  totalLikes: number;
  scheduledAt: Date;
  categoryIds: string[];
  startedAt: Date;
  endedAt: Date;
  createdAt: Date;
};

export type CreateStreamKeyRequest = {
  userId: string;
  isActive: boolean
};

export type CreateStreamRequest = {
  userId: string;
  title: string;
  description: string;
  status: string;
  thumbnail: File | null;
  latency: string;
  dvr: boolean;
  vod: boolean;
  categoryIds: string[];
}

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
  }
} 