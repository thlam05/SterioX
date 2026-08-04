import { CustomStreamPlayer } from '@/components/stream/CustomStreamPlayer';
import { ChatPanel } from '@/components/stream/ChatPanel';
import { StatCard } from '@/components/stream/StatCard';
import { StreamInfoPanel } from '@/components/stream/StreamInfoPanel';
import { SuggestedStreams } from '@/components/stream/SuggestedStreams';
import { DonationPanel } from '@/components/stream/DonationPanel';
import { STREAM_STATS } from '@/constants/streamDashboard';
import { useGetStream } from '@/hooks/stream/useGetStream';
import { useStreamSocket } from '@/hooks/stream/useStreamSocket';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { streamApi, streamChatApi } from '@/api/streamApi';
import { useAuthStore } from '@/stores/authStore';
import { useLoaderData } from 'react-router';
import { useEffect, useMemo, useState, type FormEvent } from 'react';

export default function StreamPage() {
  const streamId = useLoaderData<string | null>();
  const { user } = useAuthStore();

  const [isFollowed, setIsFollowed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const { stream, isLoading } = useGetStream({ streamId: streamId ?? '' });
  const { currentViews, currentLikes, chats, setChats } = useStreamSocket(
    stream?.id,
    user?.id,
  );

  const statusStat = STREAM_STATS[0];
  const isActive = stream?.isActive ?? false;
  const tags = useMemo(
    () => stream?.categories?.map((category) => category.name) ?? [],
    [stream?.categories],
  );

  useEffect(() => {
    if (!stream?.id) return;

    const abortController = new AbortController();

    const bootstrapStreamPage = async () => {
      try {
        const [history, likeStatus] = await Promise.all([
          streamChatApi.getChats(stream.id),
          streamApi.checkStatusLikedStream(stream.id),
        ]);

        if (!abortController.signal.aborted) {
          setChats(history);
          setIsLiked(likeStatus.isLiked);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Khong the khoi tao du lieu stream', error);
      }
    };

    bootstrapStreamPage();

    return () => abortController.abort();
  }, [stream?.id, setChats]);

  const handleLikeStream = async () => {
    if (!stream?.id) return;

    try {
      if (isLiked) {
        await streamApi.unlikeStreamById(stream.id);
        setIsLiked(false);
        return;
      }

      await streamApi.likeStreamById(stream.id);
      setIsLiked(true);
    } catch (error) {
      console.error('Khong the cap nhat trang thai like', error);
    }
  };

  const handleSendChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!stream?.id || !user?.id || !chatMessage.trim()) return;

    try {
      await streamChatApi.sendChat(stream.id, user.id, chatMessage.trim());
      setChatMessage('');
    } catch (error) {
      console.error('Khong the gui tin nhan', error);
    }
  };

  if (isLoading) return <LoadingSpinner/>;


  return (
    <div className="w-full bg-background text-foreground font-sans space-y-6 selection:bg-selection">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          stat={statusStat}
          isActive={isActive}
          dynamicValue={isActive ? 'Trực tiếp' : 'Ngoại tuyến'}
        />
        <StatCard stat={STREAM_STATS[1]} dynamicValue={currentViews} />
        <StatCard stat={STREAM_STATS[2]} dynamicValue={currentLikes} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-3xl border border-accent overflow-hidden group bg-black">
            <CustomStreamPlayer src={stream?.playUrl ?? ''} />
          </div>

          <StreamInfoPanel
            tags={tags}
            isFollowed={isFollowed}
            isLiked={isLiked}
            onToggleFollow={() => setIsFollowed(!isFollowed)}
            onLike={handleLikeStream}
          />

          <SuggestedStreams />
        </div>

        <div className="space-y-6">
          <ChatPanel
            chats={chats}
            streamUserId={stream?.user?.id}
            chatMessage={chatMessage}
            onChatMessageChange={setChatMessage}
            onSendChat={handleSendChat}
            placeholder="Gửi tin nhắn..."
          />
          <DonationPanel />
        </div>
      </div>
    </div>
  );
}
