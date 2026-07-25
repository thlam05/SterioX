import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useStreamSocket } from '@/hooks/stream/useStreamSocket';
import { streamApi, streamKeyApi, streamChatApi } from '@/api/streamApi';
import type { StreamResponse } from '@/types/streamType';

export function useStreamDashboard() {
  const { user } = useAuthStore();

  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [copied, setCopied] = useState<'streamUrl' | 'streamKey' | null>(null);

  const [stream, setStream] = useState<StreamResponse | null>(null);
  const [streamTitle, setStreamTitle] = useState('');
  const [category, setCategory] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  const { currentViews, currentLikes, chats, setChats } = useStreamSocket(
    stream?.id,
    user?.id,
  );

  const enableOnStream = useMemo(() => !!stream, [stream]);

  useEffect(() => {
    if (!user) return;
    const abortController = new AbortController();

    const fetchStreaming = async () => {
      try {
        const streamResponse = await streamApi.getStreamOnlineOfUser(user.id);
        if (!abortController.signal.aborted) {
          setStream(streamResponse);
          if (streamResponse) {
            const history = await streamChatApi.getChats(streamResponse.id);
            if (!abortController.signal.aborted) setChats(history);
          }
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.log(error);
      }
    };

    fetchStreaming();

    return () => abortController.abort();
  }, [user, setChats]);

  useEffect(() => {
    if (!user?.id) return;
    const abortController = new AbortController();

    const loadStreamKey = async () => {
      try {
        const data = await streamKeyApi.getStreamKey(user.id);
        if (!abortController.signal.aborted) {
          setStreamKey(data.streamKey ?? null);
          setStreamUrl(data.streamUrl ?? null);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('Không thể tải stream key', error);
      }
    };

    loadStreamKey();

    return () => abortController.abort();
  }, [user?.id]);

  const handleCopyStreamKey = () => {
    if (streamKey) {
      navigator.clipboard.writeText(streamKey);
      setCopied('streamKey');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleCopyStreamUrl = () => {
    if (streamUrl) {
      navigator.clipboard.writeText(streamUrl);
      setCopied('streamUrl');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleOnStream = async () => {
    if (!stream || !stream.playUrl) return;

    const streamResponse = await streamApi.startStreamById(stream.id);
    setStream(streamResponse);
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
    streamKey,
    streamUrl,
    showStreamKey,
    setShowStreamKey,
    copied,
    streamTitle,
    setStreamTitle,
    category,
    setCategory,
    chatMessage,
    setChatMessage,
    enableOnStream,
    currentViews,
    currentLikes,
    chats,
    handleCopyStreamKey,
    handleCopyStreamUrl,
    handleOnStream,
    handleSendChat,
  };
}
