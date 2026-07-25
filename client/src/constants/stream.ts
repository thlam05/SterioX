export const SOCKET_TOPICS = {
  STATUS_STREAM: (streamId: string) => `/topic/status-stream/${streamId}`,
  LIKES_STREAM: (streamId: string) => `/topic/likes-streams/${streamId}`,
  CHAT: (streamId: string) => `/topic/chat/${streamId}`,
} as const;

export const SOCKET_ENDPOINTS = {
  VIEW_STREAM: (streamId: string) => `/app/view-stream/${streamId}`,
} as const;

export const HEARTBEAT_INTERVAL_MS = 10000;
export const HEARTBEAT_MESSAGE = 'PING' as const;
