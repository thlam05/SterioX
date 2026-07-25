import { CustomStreamPlayer } from '@/components/stream/CustomStreamPlayer';
import { ChatPanel } from '@/components/stream/ChatPanel';
import { StatCard } from '@/components/stream/StatCard';
import { StreamControls } from '@/components/stream/StreamControls';
import { DonationPanel } from '@/components/stream/DonationPanel';
import { STREAM_STATS } from '@/constants/streamDashboard';
import { useStreamDashboard } from '@/hooks/stream/useStreamDashboard';

export default function StreamDashboard() {
  const {
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
  } = useStreamDashboard();

  const activeStat = stream?.isActive;
  const statusStat = STREAM_STATS[0];

  return (
    <div className="w-full bg-background text-foreground font-sans space-y-6 selection:bg-selection">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          stat={statusStat}
          isActive={activeStat}
          dynamicValue={activeStat ? 'Trực tiếp' : 'Ngoại tuyến'}
        />
        <StatCard stat={STREAM_STATS[1]} dynamicValue={currentViews} />
        <StatCard stat={STREAM_STATS[2]} dynamicValue={currentLikes} />
        <StatCard stat={STREAM_STATS[3]} />
        <StatCard stat={STREAM_STATS[4]} />
        <StatCard stat={STREAM_STATS[5]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-3xl border border-accent overflow-hidden group bg-black">
            <CustomStreamPlayer src={stream?.playUrl ?? ''} />
          </div>

          <StreamControls
            streamUrl={streamUrl}
            streamKey={streamKey}
            showStreamKey={showStreamKey}
            copied={copied}
            streamTitle={streamTitle}
            onStreamTitleChange={setStreamTitle}
            category={category}
            onCategoryChange={setCategory}
            enableOnStream={enableOnStream}
            onToggleShowKey={() => setShowStreamKey(!showStreamKey)}
            onCopyUrl={handleCopyStreamUrl}
            onCopyKey={handleCopyStreamKey}
            onOnStream={handleOnStream}
          />
        </div>

        <div className="space-y-6">
          <ChatPanel
            chats={chats}
            streamUserId={stream?.user?.id}
            chatMessage={chatMessage}
            onChatMessageChange={setChatMessage}
            onSendChat={handleSendChat}
            placeholder="Gửi tin nhắn với tư cách chủ phòng..."
          />
          <DonationPanel />
        </div>
      </div>
    </div>
  );
}
