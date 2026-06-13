import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomStreamPlayer } from "@/components/stream/CustomStreamPlayer";
import {
  Radio,
  Users,
  MessageSquare,
  Heart,
  Send,
  Sparkles,
  Share2,
  Award,
  Gift
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate, useLoaderData } from "react-router";
import { useSocket } from "@/context/SocketContext";
import type { StreamResponse } from "@/types/streamType";

export default function LivestreamPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { isConnected, sendMessage, subscribeTopic } = useSocket();
  const navigate = useNavigate();
  const loaderData = useLoaderData() as StreamResponse | null;

  const [stream, setStream] = useState<StreamResponse | null>(loaderData);
  const [chatMessage, setChatMessage] = useState("");
  const [currentViews, setCurrentViews] = useState(0);

  const [isFollowed, setIsFollowed] = useState(false);

  const tags = ["Java", "SpringBoot", "SystemDesign", "HighPerformance"];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setStream(loaderData);
  }, [loaderData]);

  useEffect(() => {
    if (!stream || !stream.id) return;

    let unsubscribe: () => void = () => { };

    const setupSocketActions = () => {
      unsubscribe = subscribeTopic(`/topic/view-livestream/${stream.id}`, (message: any) => {
        // const { viewers } = a
      });

      sendMessage(`/app/view-livestream/${stream.id}`, {
        userId: user?.id,
        message: "PING"
      });
    };

    if (isConnected) {
      setupSocketActions();
    }

    return () => {
      unsubscribe();
    }
  }, [stream, isConnected]);

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-danger">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Trạng thái</p>
            <span className={`text-sm font-black flex items-center gap-1 ${stream?.isActive ? 'text-danger' : 'text-secondary'}`}>
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
            <span className="text-sm font-black text-foreground">{stream?.totalViews ?? 0}</span>
          </div>
        </div>

        <div className="bg-background border border-accent p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-secondary font-medium">Lượt thích</p>
            <span className="text-sm font-black text-foreground">{stream?.totalLikes ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Khu vực nội dung chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cột trái và giữa: Màn hình xem trước và Cấu hình */}
        <div className="lg:col-span-2 space-y-6">

          {/* Trình xem trước luồng video */}
          <div className="relative aspect-video rounded-3xl border border-accent overflow-hidden group bg-black">
            <CustomStreamPlayer src={stream?.playUrl ? stream.playUrl : ""}></CustomStreamPlayer>
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
                  variant={isFollowed ? "outline" : "primary"} // SỬA LỖI: Thay "primary" thành "default" theo chuẩn shadcn
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
              {/* {suggestedStreams.map((stream) => ( ... ))} */}
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