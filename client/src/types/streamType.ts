import type { CategoryResponse } from "./categoryType";
import type { UserResponse } from "./userType";

export type StreamKeyResponse = {
  streamKey: string;
  userId: string;
  streamUrl: string;
  isActive: boolean;
  updatedAt: Date;
};

export type StreamResponse = {
  id: string;
  user: UserResponse;
  title: string;
  description: string;
  status: string;
  thumbnail: string;
  latency: string;
  dvr: boolean;
  vod: boolean;
  playUrl: string;
  isActive: boolean;
  onStream: boolean;
  totalViews: number;
  totalLikes: number;
  scheduledAt: Date;
  categories: CategoryResponse[];
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