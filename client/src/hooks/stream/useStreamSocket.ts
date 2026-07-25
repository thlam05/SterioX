import { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import type {
  HeartBeatMessage,
  LivestreamLikeResponse,
  LivestreamStatusResponse,
  StreamChatResponse,
} from '@/types/streamType';
import {
  SOCKET_TOPICS,
  SOCKET_ENDPOINTS,
  HEARTBEAT_INTERVAL_MS,
  HEARTBEAT_MESSAGE,
} from '@/constants/stream';

export function useStreamSocket(
  streamId: string | undefined,
  userId: string | undefined,
) {
  const { isConnected, sendMessage, subscribeTopic } = useSocket();
  const [currentViews, setCurrentViews] = useState(0);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [chats, setChats] = useState<StreamChatResponse[]>([]);

  useEffect(() => {
    if (!streamId || !userId) return;

    let unsubscribeStatus = () => {};
    let unsubscribeLikes = () => {};
    let unsubscribeChat = () => {};
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

    const setupSocketActions = () => {
      unsubscribeStatus = subscribeTopic(
        SOCKET_TOPICS.STATUS_STREAM(streamId),
        (message: LivestreamStatusResponse) => {
          setCurrentViews(message.views);
          setCurrentLikes(message.likes);
        },
      );

      unsubscribeLikes = subscribeTopic(
        SOCKET_TOPICS.LIKES_STREAM(streamId),
        (message: LivestreamLikeResponse) => {
          setCurrentLikes(message.likes);
        },
      );

      unsubscribeChat = subscribeTopic(
        SOCKET_TOPICS.CHAT(streamId),
        (message: StreamChatResponse) => {
          setChats((prev) => [...prev, message]);
        },
      );

      const sendHeartbeat = () => {
        const payload: HeartBeatMessage = {
          userId,
          message: HEARTBEAT_MESSAGE,
        };
        sendMessage(SOCKET_ENDPOINTS.VIEW_STREAM(streamId), payload);
      };

      sendHeartbeat();
      heartbeatInterval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    };

    if (isConnected) {
      setupSocketActions();
    }

    return () => {
      unsubscribeStatus();
      unsubscribeLikes();
      unsubscribeChat();
      if (heartbeatInterval != null) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [streamId, userId, isConnected, sendMessage, subscribeTopic]);

  return { currentViews, currentLikes, chats, setChats };
}
