import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import type { HeartBeatMessage, LivestreamLikeResponse, LivestreamStatusResponse, StreamChatResponse } from "@/types/streamType";

export function useStreamSocket(streamId: string | undefined, userId: string | undefined) {
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
      unsubscribeStatus = subscribeTopic(`/topic/status-stream/${streamId}`, (message: LivestreamStatusResponse) => {
        setCurrentViews(message.views);
        setCurrentLikes(message.likes);
      });

      unsubscribeLikes = subscribeTopic(`/topic/likes-streams/${streamId}`, (message: LivestreamLikeResponse) => {
        setCurrentLikes(message.likes);
      });

      unsubscribeChat = subscribeTopic(`/topic/chat/${streamId}`, (message: StreamChatResponse) => {
        setChats((prev) => [...prev, message]);
      });

      const sendHeartbeat = () => {
        const payload: HeartBeatMessage = {
          userId,
          message: "PING",
        };
        sendMessage(`/app/view-stream/${streamId}`, payload);
      };

      sendHeartbeat();
      heartbeatInterval = setInterval(sendHeartbeat, 10000);
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
