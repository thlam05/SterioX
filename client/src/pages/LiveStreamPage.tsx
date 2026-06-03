import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  MessageSquare,
  Heart,
  Share2,
  Send,
  Users,
  Gift,
  Award,
  AlertCircle
} from "lucide-react";

export default function LivestreamPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isFollowed, setIsFollowed] = useState(false);

  const tags = ["Công nghệ", "Lập trình", "NextJS", "AI"];

  const chatLogs = [
    { id: 1, user: "HoangLong_Dev", message: "Giao diện mượt quá anh ơi!", badge: "pro" },
    { id: 2, user: "MinhThu_Tech", message: "Steriox có hỗ trợ luồng 4k không ạ?", badge: "fan" },
    { id: 3, user: "QuocAnh_99", message: "Chào mọi người nhé, chúc buổi stream vui vẻ", badge: "" },
    { id: 4, user: "CoderDauBac", message: "Source code phần này có chia sẻ không chủ thớt?", badge: "sub" },
    { id: 5, user: "AI_Explorer", message: "Đang đợi đoạn tích hợp OpenAI Agent", badge: "fan" },
    { id: 6, user: "NguyenVanA", message: "Âm thanh vòm nghe đỉnh thật sự", badge: "" },
  ];

  const suggestedStreams = [
    { id: 1, title: "Xây dựng hệ thống phân tán với Rust", streamer: "Rustacean VN", viewers: "1.2k", emoji: "🦀" },
    { id: 2, title: "UI/UX chuẩn mực thiết kế toàn cầu", streamer: "DesignStudio", viewers: "950", emoji: "🎨" },
    { id: 3, title: "Review bàn phím cơ custom công thái học", streamer: "Mê Cơ Học", viewers: "2.1k", emoji: "⌨️" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Thân trang chính chia làm hai vùng: luồng phát và khung chat */}
      <div className="flex-grow flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto gap-4">

        {/* Vùng bên trái: Trình phát video và thông tin chi tiết */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Trình phát Video giả lập */}
          <div className="relative aspect-video bg-foreground rounded-2xl overflow-hidden group border border-accent">
            {/* Nội dung video giả lập */}
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <div className="text-8xl animate-pulse">💻</div>
              <p className="text-background text-sm font-bold mt-4 bg-foreground/60 px-4 py-2 rounded-full backdrop-blur-sm">
                Đang truyền phát luồng chất lượng cao 1080p 60fps
              </p>
            </div>

            {/* Nhãn trạng thái trực tiếp */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="bg-danger text-background text-xs font-bold px-3 py-1 rounded-md tracking-wider">
                Trực tiếp
              </span>
              <span className="bg-foreground/70 text-background text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                <Users className="w-3.5 h-3.5 text-info" /> 14.5k đang xem
              </span>
            </div>

            {/* Thanh điều khiển video khi di chuột vào */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-background hover:text-primary transition-colors focus:outline-none"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-background hover:text-primary transition-colors focus:outline-none"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <span className="text-background text-xs font-mono">01:45:22</span>
              </div>

              <div className="flex items-center gap-4">
                <button className="text-background hover:text-primary transition-colors focus:outline-none">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="text-background hover:text-primary transition-colors focus:outline-none">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thanh thời gian tuyến tính */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent/30 group-hover:h-1.5 transition-all">
              <div className="h-full bg-primary w-2/3"></div>
            </div>
          </div>

          {/* Thông tin Streamer và buổi Livestream */}
          <div className="bg-background border border-accent rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Thông tin chủ phòng */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-selection text-foreground flex items-center justify-center text-2xl border border-primary font-bold shrink-0">
                  🚀
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-black text-foreground">Steriox_TechMaster</h1>
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
                <Button
                  variant={isFollowed ? "outline" : "primary"}
                  onClick={() => setIsFollowed(!isFollowed)}
                  className="font-bold flex items-center gap-2 px-5"
                >
                  <Heart className={`w-4 h-4 ${isFollowed ? "fill-current text-primary" : ""}`} />
                  {isFollowed ? "Đã theo dõi" : "Theo dõi"}
                </Button>
                <Button variant="outline" className="font-bold flex items-center gap-2 border-accent">
                  <Gift className="w-4 h-4 text-warning" /> Tặng quà
                </Button>
                <Button variant="outline" className="p-2 border-accent text-secondary hover:text-foreground">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <hr className="border-accent" />

            {/* Tiêu đề và Mô tả bài viết */}
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-foreground leading-snug">
                Hướng dẫn xây dựng nền tảng livestream quy mô lớn với ReactJS, NextJS 16 và Tailwind CSS
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag, idx) => (
                  <span key={idx} className="text-xs font-bold bg-accent text-foreground px-3 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-secondary leading-relaxed pt-2">
                Chào mừng các bạn đến với buổi học thực chiến tối nay. Chúng ta sẽ cùng nhau phân tích kiến trúc hệ thống dữ liệu thời gian thực, cách tối ưu hóa hiệu năng render luồng dữ liệu và áp dụng hệ thống thiết kế màu sắc chuẩn chỉnh toàn cầu. Đừng ngần ngại đặt câu hỏi tại khung chat nhé!
              </p>
            </div>
          </div>

          {/* Gợi ý các luồng phát sóng khác */}
          <div className="space-y-3 hidden sm:block">
            <h3 className="text-sm font-black text-secondary uppercase tracking-wider">
              Các luồng phát sóng đề xuất
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestedStreams.map((stream) => (
                <div key={stream.id} className="bg-background border border-accent rounded-xl p-3 flex gap-3 hover:border-primary cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-foreground text-background flex items-center justify-center text-2xl shrink-0 select-none">
                    {stream.emoji}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground truncate">{stream.title}</h4>
                    <p className="text-[11px] text-secondary truncate">{stream.streamer}</p>
                    <p className="text-[10px] text-info font-medium flex items-center gap-1">
                      <Users className="w-3 h-3" /> {stream.viewers} người xem
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Vùng bên phải: Khung Chat trực tuyến */}
        <div className="w-full lg:w-[380px] bg-background border border-accent rounded-2xl flex flex-col h-[500px] lg:h-auto overflow-hidden">
          {/* Tiêu đề khung chat */}
          <div className="px-4 py-3 border-b border-accent flex items-center justify-between bg-background">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-black text-foreground">Trò chuyện trực tuyến</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-secondary font-medium">
              <span className="w-2 h-2 rounded-full bg-success"></span> Chế độ phòng: Mở
            </div>
          </div>

          {/* Danh sách tin nhắn chat */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background">
            <div className="bg-info-light/30 border border-info rounded-xl p-3 text-xs text-foreground flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-info shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Chào mừng bạn đến với phòng chat Steriox! Hãy tôn trọng những người xem khác và tuân thủ các điều khoản nguyên tắc cộng đồng của chúng tôi.
              </p>
            </div>

            {chatLogs.map((log) => (
              <div key={log.id} className="text-sm items-start leading-relaxed group">
                <span className="inline-block mr-1.5">
                  {log.badge === "pro" && (
                    <span className="bg-primary text-background text-[9px] font-black px-1 py-0.5 rounded uppercase">Pro</span>
                  )}
                  {log.badge === "fan" && (
                    <span className="bg-info text-background text-[9px] font-black px-1 py-0.5 rounded uppercase">Fan cứng</span>
                  )}
                  {log.badge === "sub" && (
                    <span className="bg-success text-background text-[9px] font-black px-1 py-0.5 rounded uppercase">Người hộ</span>
                  )}
                </span>
                <span className="font-extrabold text-secondary hover:text-foreground cursor-pointer mr-2">
                  {log.user}:
                </span>
                <span className="text-foreground font-medium">
                  {log.message}
                </span>
              </div>
            ))}
          </div>

          {/* Vùng nhập nội dung chat */}
          <div className="p-4 border-t border-accent bg-background space-y-3">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Gửi tin nhắn đến phòng trò chuyện..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 border border-accent bg-background text-foreground rounded-xl text-sm"
              />
              <Button variant="primary" className="px-4 py-2 rounded-xl flex items-center justify-center">
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Thanh biểu tượng tương tác nhanh */}
            <div className="flex items-center justify-between text-xs text-secondary pt-1">
              <div className="flex items-center gap-2">
                <span className="cursor-pointer hover:scale-125 transition-transform">🔥</span>
                <span className="cursor-pointer hover:scale-125 transition-transform">❤️</span>
                <span className="cursor-pointer hover:scale-125 transition-transform">🎉</span>
                <span className="cursor-pointer hover:scale-125 transition-transform">😮</span>
                <span className="cursor-pointer hover:scale-125 transition-transform">👏</span>
              </div>
              <span className="text-[11px] text-secondary font-medium">Tối đa 200 ký tự</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}