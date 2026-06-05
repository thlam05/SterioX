import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { VideoPlayer } from "@/components/stream/VideoPlayer";
import {
  Radio,
  Tv,
  Users,
  MessageSquare,
  Heart,
  Sliders,
  Shield,
  Activity,
  Maximize2,
  Volume2,
  Send,
  Zap,
  Clock,
  AlertTriangle,
  Play,
  Square,
  Sparkles,
  Share2
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";
import { streamApi, type StreamResponse } from "@/api/streamApi";

export default function LivestreamDashboard() {
  const { user, isAuthenticated } = useAuthStore();

  const navigate = useNavigate();

  const [stream, setStream] = useState<StreamResponse | null>(null);
  const [streamTitle, setStreamTitle] = useState("Lập trình hệ thống phân tán hiệu năng cao với Java và Spring Boot");
  const [category, setCategory] = useState("Công nghệ & Lập trình");
  const [chatMessage, setChatMessage] = useState("");
  const [isLive, setIsLive] = useState(true);
  const defaultVideoSource = "http://localhost:5555/hls/ebf71facd3374ce1bccba3525f507e83.m3u84";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchStreaming = async () => {
      try {
        const streamResponse = await streamApi.getStreamOnlineOfUSer(user.id);
        console.log(streamResponse);
        setStream(streamResponse);
      } catch (error) {
        console.log(error);
      }
    }

    fetchStreaming();

  }, [user, isAuthenticated]);

  const mockMetrics = {
    viewers: "2,450",
    likes: "1,820",
    duration: "01:45:22",
    bitrate: "6,200 Kbps",
    fps: "60 FPS",
    resolution: "1080p"
  };

  const mockChats = [
    { id: 1, user: "Lâm", text: "Chào mọi người, hôm nay chúng ta sẽ tối ưu hoá kết nối DB nhé.", time: "16:12", isStreamer: true },
    { id: 2, user: "Hoàng Nam", text: "Dự án này có sử dụng mô hình Master-Slave không anh?", time: "16:13", isStreamer: false },
    { id: 3, user: "Minh Thư", text: "Luồng mượt quá, cấu hình OBS thế nào vậy ạ?", time: "16:14", isStreamer: false },
    { id: 4, user: "Quốc Anh", text: "Chào sếp Lâm, hướng dẫn phần Nginx load balancing kỹ hơn chút nhé.", time: "16:15", isStreamer: false },
    { id: 5, user: "Thanh Sơn", text: "Bên MoMo Sandbox kết nối trực tiếp với Worker luôn hả anh?", time: "16:16", isStreamer: false }
  ];

  const mockDonations = [
    { id: 1, user: "Duy Mạnh", amount: "50,000 VND", message: "Ủng hộ anh Lâm chia sẻ kiến thức hay!" },
    { id: 2, user: "Ngọc Linh", amount: "100,000 VND", message: "Project cuốn quá anh ơi." }
  ];

  return (

    <div className="w-full bg-background text-foreground font-sans space-y-6 selection:bg-selection">

      {/* Thống kê nhanh trạng thái dòng chảy */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-danger">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Trạng thái</p>
            <span className={`text-sm font-black flex items-center gap-1 ${isLive ? 'text-danger' : 'text-secondary'}`}>
              {isLive ? 'Trực tiếp' : 'Ngoại tuyến'}
            </span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-info">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Người xem</p>
            <span className="text-sm font-black text-foreground">{mockMetrics.viewers}</span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Lượt thích</p>
            <span className="text-sm font-black text-foreground">{mockMetrics.likes}</span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-warning">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Thời gian phát</p>
            <span className="text-sm font-black text-foreground">{mockMetrics.duration}</span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-success">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Tốc độ bit</p>
            <span className="text-sm font-black text-foreground">{mockMetrics.bitrate}</span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-foreground">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Độ phân giải</p>
            <span className="text-sm font-black text-foreground">{mockMetrics.resolution} ({mockMetrics.fps})</span>
          </div>
        </div>
      </div>

      {/* Khu vực nội dung chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cột trái và giữa: Màn hình xem trước và Cấu hình */}
        <div className="lg:col-span-2 space-y-6">

          {/* Trình xem trước luồng video */}
          <div className="relative aspect-video rounded-3xl border border-accent overflow-hidden group bg-black">
            <VideoPlayer src={"http://localhost:5555/hls/ebf71facd3374ce1bccba3525f507e83.m3u8"}></VideoPlayer>
          </div>

          {/* Bảng điều khiển tác vụ cốt lõi */}
          <div className="bg-background border border-accent p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                <Sliders className="w-5 h-5 text-primary" /> Công cụ thao tác nhanh
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" className="text-xs font-bold flex items-center gap-1.5 text-danger border-accent">
                  <AlertTriangle className="w-3.5 h-3.5" /> Báo cáo sự cố
                </Button>
                <Button variant="outline" className="text-xs font-bold flex items-center gap-1.5 border-accent">
                  <Share2 className="w-3.5 h-3.5" /> Chia sẻ luồng
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {isLive ? (
                <Button
                  onClick={() => setIsLive(false)}
                  className="bg-danger text-background hover:bg-danger-light hover:text-foreground font-bold px-6 flex items-center gap-2 rounded-xl"
                >
                  <Square className="w-4 h-4 fill-current" /> Dừng phát trực tiếp
                </Button>
              ) : (
                <Button
                  onClick={() => setIsLive(true)}
                  className="bg-success text-background hover:bg-success-light hover:text-foreground font-bold px-6 flex items-center gap-2 rounded-xl"
                >
                  <Play className="w-4 h-4 fill-current" /> Bắt đầu phát trực tiếp
                </Button>
              )}

              <Button variant="outline" className="font-bold px-4 flex items-center gap-2 border-accent">
                <Zap className="w-4 h-4 text-warning" /> Kích hoạt quảng cáo ngắn
              </Button>

              <Button variant="outline" className="font-bold px-4 flex items-center gap-2 border-accent">
                <Shield className="w-4 h-4 text-info" /> Chế độ chậm (Chat)
              </Button>
            </div>

            <div className="border-t border-accent pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
                  Tiêu đề buổi phát sóng
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

          {/* Hộp thoại trò chuyện thời gian thực */}
          <div className="bg-background border border-accent rounded-3xl flex flex-col h-[400px] overflow-hidden">
            <div className="p-4 border-b border-accent bg-background flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-black tracking-tight">Trò chuyện trực tiếp</h3>
              </div>
              <span className="text-[11px] font-bold bg-selection text-primary px-2 py-0.5 rounded-full">
                Kết nối tốt
              </span>
            </div>

            {/* Danh sách các tin nhắn */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background">
              {mockChats.map((chat) => (
                <div key={chat.id} className="text-xs leading-relaxed flex items-start gap-2">
                  <span className="text-secondary font-medium tracking-tighter shrink-0 pt-0.5">{chat.time}</span>
                  <div>
                    <span className={`font-black mr-2 ${chat.isStreamer ? 'text-primary bg-selection px-1.5 py-0.5 rounded-md text-[10px]' : 'text-foreground'}`}>
                      {chat.user}
                    </span>
                    <span className="text-secondary">{chat.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Khu vực gửi tin nhắn */}
            <form onSubmit={(e) => e.preventDefault()} className="p-3 border-t border-accent bg-background flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Gửi tin nhắn với tư cách chủ phòng..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
              </div>
              <Button variant="primary" className="px-4 py-2 rounded-xl flex items-center justify-center">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Danh sách ủng hộ, quyên góp gần đây */}
          <div className="bg-background border border-accent p-4 rounded-3xl space-y-3">
            <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-warning" /> Vinh danh quyên góp mới nhất
            </h3>

            <div className="space-y-2.5">
              {mockDonations.map((donation) => (
                <div key={donation.id} className="bg-background border border-accent p-3 rounded-xl flex flex-col gap-1 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground">{donation.user}</span>
                    <span className="text-xs font-black text-success bg-accent px-2 py-0.5 rounded-md">
                      {donation.amount}
                    </span>
                  </div>
                  <p className="text-xs text-secondary italic leading-normal">
                    "{donation.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}