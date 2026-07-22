import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEffect, useState } from 'react';
import { CustomStreamPlayer } from '@/components/stream/CustomStreamPlayer';
import { ChatPanel } from '@/components/stream/ChatPanel';
import { StreamKeyField } from '@/components/stream/StreamKeyField';
import {
  Radio,
  Tv,
  Users,
  Heart,
  Sliders,
  Activity,
  Clock,
  AlertTriangle,
  Sparkles,
  Share2,
  Power,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useStreamSocket } from '@/hooks/useStreamSocket';
import { streamApi, streamKeyApi, streamChatApi } from '@/api/streamApi';
import type { StreamResponse } from '@/types/streamType';

export default function StreamDashboard() {
  const { user } = useAuthStore();

  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [copied, setCopied] = useState<'streamUrl' | 'streamKey' | null>(null);

  const [stream, setStream] = useState<StreamResponse | null>(null);
  const [streamTitle, setStreamTitle] = useState('');
  const [category, setCategory] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [enableOnStream, setEnableOnStream] = useState(false);

  const { currentViews, currentLikes, chats, setChats } = useStreamSocket(
    stream?.id,
    user?.id,
  );

  useEffect(() => {
    setEnableOnStream(!!stream);
  }, [stream]);

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
  }, [user]);

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

  return (
    <div className="w-full bg-background text-foreground font-sans space-y-6 selection:bg-selection">
      {/* Thống kê nhanh trạng thái dòng chảy */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-danger">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Trạng thái</p>
            <span
              className={`text-sm font-black flex items-center gap-1 ${stream?.isActive ? 'text-danger' : 'text-secondary'}`}
            >
              {stream?.isActive ? 'Trực tiếp' : 'Ngoại tuyến'}
            </span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-info">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Người xem</p>
            <span className="text-sm font-black text-foreground">
              {currentViews}
            </span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Lượt thích</p>
            <span className="text-sm font-black text-foreground">
              {currentLikes}
            </span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-warning">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Thời gian phát</p>
            <span className="text-sm font-black text-foreground">--:--:--</span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-success">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Tốc độ bit</p>
            <span className="text-sm font-black text-foreground">-- Kbps</span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-foreground">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Độ phân giải</p>
            <span className="text-sm font-black text-foreground">--</span>
          </div>
        </div>
      </div>

      {/* Khu vực nội dung chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái và giữa: Màn hình xem trước và Cấu hình */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trình xem trước luồng video */}
          <div className="relative aspect-video rounded-3xl border border-accent overflow-hidden group bg-black">
            <CustomStreamPlayer
              src={stream?.playUrl ? stream.playUrl : ''}
            ></CustomStreamPlayer>
          </div>

          {/* Bảng điều khiển tác vụ cốt lõi */}
          <div className="bg-background border border-accent p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                <Sliders className="w-5 h-5 text-primary" /> Công cụ thao tác
                nhanh
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  disabled={!enableOnStream}
                  className="text-xs font-bold flex items-center gap-1.5 text-danger border-accent"
                  onClick={handleOnStream}
                >
                  <Power className="w-3.5 h-3.5" /> On stream
                </Button>
                <Button
                  variant="outline"
                  className="text-xs font-bold flex items-center gap-1.5 text-danger border-accent"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Báo cáo sự cố
                </Button>
                <Button
                  variant="outline"
                  className="text-xs font-bold flex items-center gap-1.5 border-accent"
                >
                  <Share2 className="w-3.5 h-3.5" /> Chia sẻ luồng
                </Button>
              </div>
            </div>

            <StreamKeyField
              streamUrl={streamUrl}
              streamKey={streamKey}
              showStreamKey={showStreamKey}
              copied={copied}
              onToggleShowKey={() => setShowStreamKey(!showStreamKey)}
              onCopyUrl={handleCopyStreamUrl}
              onCopyKey={handleCopyStreamKey}
            />

            <div className="border-t border-accent pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
                  Tiêu đề buổi phát sóngs
                </label>
                <Input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
                  Chuyên mục hiển thị
                </label>
                <Input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Khung tương tác trò chuyện & Vinh danh quyên góp */}
        <div className="space-y-6">
          <ChatPanel
            chats={chats}
            streamUserId={stream?.user?.id}
            chatMessage={chatMessage}
            onChatMessageChange={setChatMessage}
            onSendChat={handleSendChat}
            placeholder="Gửi tin nhắn với tư cách chủ phòng..."
          />

          {/* Danh sách ủng hộ, quyên góp gần đây */}
          <div className="bg-background border border-accent p-4 rounded-3xl space-y-3">
            <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-warning" /> Vinh danh quyên góp
              mới nhất
            </h3>

            <div className="space-y-2.5">
              <p className="text-xs text-secondary italic text-center py-4">
                Chưa có quyên góp nào.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
