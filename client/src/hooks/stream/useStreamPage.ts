import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useLoaderData } from 'react-router';
import { useStreamSocket } from '@/hooks/stream/useStreamSocket';
import type { StreamResponse } from '@/types/streamType';
import { streamApi, streamChatApi } from '@/api/streamApi';

export function useStreamPage() {
  const { user } = useAuthStore();
  const loaderData = useLoaderData() as StreamResponse | null;

  const [stream, setStream] = useState<StreamResponse | null>(loaderData);
  const [chatMessage, setChatMessage] = useState('');
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { currentViews, currentLikes, chats, setChats } = useStreamSocket(
    stream?.id,
    user?.id,
  );

  const tags = stream?.title ? stream.title.split(' ').slice(0, 5) : [];

  useEffect(() => {
    if (!stream) return;
    const abortController = new AbortController();

    const fetchLikeStatus = async () => {
      try {
        const { isLiked } = await streamApi.checkStatusLikedStream(stream.id);
        if (!abortController.signal.aborted) setIsLiked(isLiked);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.log(error);
      }
    };

    const fetchChatHistory = async () => {
      try {
        const history = await streamChatApi.getChats(stream.id);
        if (!abortController.signal.aborted) setChats(history);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('Không thể tải lịch sử chat', error);
      }
    };

    fetchLikeStatus();
    fetchChatHistory();

    return () => abortController.abort();
  }, [stream, setChats]);

  const handleLikeStream = async () => {
    if (!stream || !user) return;

    try {
      if (isLiked) {
        await streamApi.unlikeStreamById(stream.id);
      } else {
        await streamApi.likeStreamById(stream.id);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stream || !user || !chatMessage.trim()) return;

    try {
      await streamChatApi.sendChat(stream.id, user.id, chatMessage.trim());
      setChatMessage('');
    } catch (error) {
      console.error('Không thể gửi tin nhắn', error);
    }
  };

  return {
    stream,
    user,
    chatMessage,
    setChatMessage,
    isFollowed,
    setIsFollowed,
    isLiked,
    currentViews,
    currentLikes,
    chats,
    tags,
    handleLikeStream,
    handleSendChat,
  };
}
