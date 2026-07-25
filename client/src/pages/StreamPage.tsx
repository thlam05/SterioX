import { CustomStreamPlayer } from '@/components/stream/CustomStreamPlayer';
import { ChatPanel } from '@/components/stream/ChatPanel';
import { StatCard } from '@/components/stream/StatCard';
import { StreamInfoPanel } from '@/components/stream/StreamInfoPanel';
import { SuggestedStreams } from '@/components/stream/SuggestedStreams';
import { DonationPanel } from '@/components/stream/DonationPanel';
import { STREAM_STATS } from '@/constants/streamDashboard';
import { useStreamPage } from '@/hooks/stream/useStreamPage';

export default function StreamPage() {
  const {
    stream,
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
  } = useStreamPage();

  const isActive = stream?.isActive;
  const statusStat = STREAM_STATS[0];

  return (
    <div className="w-full bg-background text-foreground font-sans space-y-6 selection:bg-selection">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          stat={statusStat}
          isActive={isActive}
          dynamicValue={isActive ? 'Trực tiếp' : 'Ngoại tuyến'}
        />
        <StatCard stat={STREAM_STATS[1]} dynamicValue={currentViews ?? 0} />
        <StatCard stat={STREAM_STATS[2]} dynamicValue={currentLikes ?? 0} />
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
