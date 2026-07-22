import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CustomStreamPlayer } from '@/components/stream/CustomStreamPlayer';
import { ChatPanel } from '@/components/stream/ChatPanel';
import {
  Radio,
  Users,
  Heart,
  Sparkles,
  Share2,
  Award,
  Gift,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useLoaderData } from 'react-router';
import { useStreamSocket } from '@/hooks/useStreamSocket';
import type { StreamResponse } from '@/types/streamType';
import { streamApi, streamChatApi } from '@/api/streamApi';

export default function StreamPage() {
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
    setStream(loaderData);
  }, [loaderData]);

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
  }, [stream]);

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
              {currentViews ?? 0}
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
              {currentLikes ?? 0}
            </span>
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
          <div className="bg-background border border-accent rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Thông tin chủ phòng */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-selection text-foreground flex items-center justify-center text-2xl border border-primary font-bold shrink-0">
                  🚀
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-black text-foreground">
                      Steriox_TechMaster
                    </h1>
                    <span className="bg-warning text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Award className="w-3 h-3" /> Đối tác
                    </span>
                  </div>
                  <p className="text-sm font-medium text-secondary">
                    Chuyên mục: Lập trình & Phát triển ứng dụng
                  </p>
                </div>
              </div>

              {/* Cụm nút tương tác hành động */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Nút Theo dõi */}
                <Button
                  variant={isFollowed ? 'outline' : 'primary'}
                  onClick={() => setIsFollowed(!isFollowed)}
                  className="font-bold flex items-center gap-2 px-5"
                >
                  {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
                </Button>

                <Button
                  variant={isLiked ? 'outline' : 'primary'}
                  onClick={handleLikeStream}
                  className="font-bold flex items-center gap-2 px-5"
                >
                  <Heart className={`w-4 h-4`} />
                  {isLiked ? 'Đã thích' : 'Thích'}
                </Button>

                {/* Nút Tặng quà */}
                <Button
                  variant="outline"
                  className="font-bold flex items-center gap-2 border-accent"
                >
                  <Gift className="w-4 h-4 text-warning fill-warning/20" /> Tặng
                  quà
                </Button>
                {/* Nút Chia sẻ */}
                <Button
                  variant="outline"
                  className="p-2 border-accent text-secondary hover:text-foreground"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <hr className="border-accent" />

            {/* Tiêu đề và Mô tả bài viết */}
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-foreground leading-snug">
                Hướng dẫn xây dựng nền tảng livestream quy mô lớn với ReactJS,
                NextJS 16 và Tailwind CSS
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-bold bg-accent text-foreground px-3 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-secondary leading-relaxed pt-2">
                Chào mừng các bạn đến với buổi học thực chiến tối nay. Chúng ta
                sẽ cùng nhau phân tích kiến trúc hệ thống dữ liệu thời gian
                thực, cách tối ưu hóa hiệu năng render luồng dữ liệu và áp dụng
                hệ thống thiết kế màu sắc chuẩn chỉnh toàn cầu. Đừng ngần ngại
                đặt câu hỏi tại khung chat nhé!
              </p>
            </div>
          </div>

          {/* Gợi ý các luồng phát sóng khác */}
          <div className="space-y-3 hidden sm:block">
            <h3 className="text-sm font-black text-secondary uppercase tracking-wider">
              Các luồng phát sóng đề xuất
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
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
            placeholder="Gửi tin nhắn..."
          />

          {/* Danh sách ủng hộ, quyên góp gần đây */}
          <div className="bg-background border border-accent p-4 rounded-3xl space-y-3">
            <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-warning" /> Vinh danh quyên góp
              mới nhất
            </h3>

            <div className="space-y-2.5">
              <p className="text-xs text-secondary italic text-center py-4">
                Chưa có quyên góp nào. Hãy là người đầu tiên!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
