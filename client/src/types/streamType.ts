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
  thumbnail: string;
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
  thumbnail: File | null;
  categoryIds: string[];
}

export type HeartBeatMessge = {
  userId: string;
  message: string;
}

export type LivestreamStatusResponse = {
  views: number;
  likes: number;
}

export type LivestreamLikeRequest = {
  userId: string;
}

export type LivestreamLikeResponse = {
  likes: number;
}

export type LivestreamLikeStatusResponse = {
  isLiked: boolean;
}

export type StreamChatResponse = {
  id: string;
  streamId: string;
  user: UserResponse;
  content: string;
  isPinned: boolean;
  isToxic: boolean;
  createdAt: string;
}