import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Video,
  Copy,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Globe,
  Lock,
  Link2,
  KeyRound,
  Zap
} from "lucide-react";
import { streamApi } from "@/api/streamApi";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";

export default function LivestreamSettingPage() {
  const { isAuthenticated, user } = useAuthStore();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("public");
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [latency, setLatency] = useState("normal");
  const [dvr, setDvr] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!user?.id) return;

    const loadStreamKey = async () => {
      try {
        const data = await streamApi.getStreamKey(user.id);
        setStreamKey(data.streamKey ?? null);
        setStreamUrl(data.streamUrl ?? null);
      } catch (error) {
        console.error("Failed to load stream key", error);
      }
    };

    loadStreamKey();
  }, [user?.id]);

  const handleCreateStreamKey = async () => {
    if (!user?.id) return;

    try {
      const data = await streamApi.createStreamKey({ userId: user.id, isActive: false });
      setStreamKey(data.streamKey ?? null);
      setStreamUrl(data.streamUrl ?? null);
    } catch (error) {
      console.error("Failed to create or load stream key", error);
    }
  };

  const handleCopyStreamKey = () => {
    if (streamKey) {
      navigator.clipboard.writeText(streamKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleThumbnailChange = () => {
    setThumbnail("✨ Đã chọn ảnh thumbnail.png");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="w-full bg-background text-foreground font-sans p-4 md:p-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cột trái: Điền các thông số livestream */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-background border border-accent rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-accent pb-6">
              <div className="w-12 h-12 rounded-2xl bg-selection text-primary flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight">Chi tiết buổi phát</h1>
                <p className="text-xs text-secondary">Cấu hình cách người xem nhìn thấy livestream của bạn</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest opacity-60 uppercase">Tiêu đề</label>
                <Input
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <div className="flex justify-between text-[10px] font-medium text-secondary">
                  <span>Mẹo: Tiêu đề ngắn gọn sẽ thu hút hơn</span>
                  <span className={title.length > 90 ? "text-danger" : ""}>{title.length}/100</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest opacity-60 uppercase">Mô tả</label>
                <textarea
                  className="w-full min-h-[160px] px-4 py-3 bg-background border border-accent rounded-2xl text-sm focus:border-primary outline-none transition-all resize-none"
                  placeholder="Bạn muốn chia sẻ điều gì trong buổi live này?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold tracking-widest opacity-60 uppercase">Quyền riêng tư</label>
                  <div className="space-y-3">
                    {[
                      { id: 'public', label: 'Công khai', desc: 'Ai cũng thấy', icon: Globe },
                      { id: 'unlisted', label: 'Không công khai', desc: 'Chỉ người có link', icon: Link2 },
                      { id: 'private', label: 'Riêng tư', desc: 'Chỉ mình bạn', icon: Lock },
                    ].map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:border-primary/50 ${status === item.id ? "border-primary bg-selection" : "border-accent"}`}
                      >
                        <input type="radio" name="status" className="hidden" onChange={() => setStatus(item.id)} />
                        <item.icon className={`w-5 h-5 ${status === item.id ? "text-primary" : "text-secondary"}`} />
                        <div className="flex-grow">
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="text-[10px] text-secondary">{item.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${status === item.id ? "border-primary" : "border-accent"}`}>
                          {status === item.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold tracking-widest opacity-60 uppercase">Hình thu nhỏ</label>
                  <div
                    onClick={handleThumbnailChange}
                    className="group relative border border-dashed border-accent hover:border-primary rounded-3xl aspect-video flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-accent"
                  >
                    {thumbnail ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-success mb-2" />
                        <p className="text-xs font-bold text-foreground truncate w-full px-4">{thumbnail}</p>
                        <p className="text-[10px] text-secondary mt-1 underline">Nhấp để thay đổi</p>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-6 h-6 text-secondary group-hover:text-primary" />
                        </div>
                        <p className="text-xs font-bold">Tải ảnh lên</p>
                        <p className="text-[10px] text-secondary mt-1">Chuẩn 16:9 (1280x720)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              <div className="flex items-center justify-end gap-3 pt-4 border-t border-accent">
                {/* <Button variant="outline" type="button">Hủy thay đổi</Button> */}
                <Button variant="primary" type="submit" disabled={!streamKey}>Lưu thiết lập phát sóng</Button>
              </div>
            </form>
          </section>
        </div>

        {/* Cột phải: Cấu hình khóa luồng kỹ thuật */}
        <div className="space-y-6">

          {/* Section Stream Key - Có kiểm tra trạng thái */}
          <section className="bg-background border border-accent rounded-3xl p-6 relative overflow-hidden min-h-[250px] flex flex-col justify-center">
            {streamKey ? (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-black tracking-tight uppercase">Cấu hình phần mềm</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Server URL</label>
                    <div className="relative group">
                      <Input readOnly value={streamUrl} className="bg-accent font-mono text-[11px] pr-10 border-accent" />
                      <button onClick={() => { }} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Stream Key</label>
                      <span className="text-[9px] font-bold text-danger flex items-center gap-1 bg-selection px-1.5 py-0.5 rounded uppercase">
                        <AlertCircle className="w-3 h-3" /> Bảo mật
                      </span>
                    </div>
                    <div className="relative group">
                      <Input
                        type={showStreamKey ? "text" : "password"}
                        readOnly
                        value={streamKey}
                        className="bg-accent font-mono text-[11px] pr-20 tracking-widest border-accent"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button onClick={() => setShowStreamKey(!showStreamKey)} className="p-1.5 text-secondary hover:text-foreground">
                          {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={handleCopyStreamKey} className="p-1.5 text-secondary hover:text-foreground">
                          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Trạng thái chưa đăng ký Key */
              <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-selection rounded-full flex items-center justify-center mx-auto mb-2 text-primary border border-primary/20">
                  <KeyRound className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase">Chưa có khóa luồng</h3>
                  <p className="text-[10px] text-secondary mt-1 px-4">Bạn cần khởi tạo Stream Key để bắt đầu truyền tín hiệu từ phần mềm (OBS, vMix...)</p>
                </div>
                <Button
                  onClick={handleCreateStreamKey}
                  variant="primary"
                  // size="sm"
                  className="w-full max-w-[200px] rounded-xl font-bold uppercase tracking-tight gap-2"
                >
                  <Zap className="w-4 h-4" /> Khởi tạo ngay
                </Button>
              </div>
            )}
          </section>

          {/* Cấu hình nâng cao tối ưu phát sóng */}
          <section className="bg-background border border-accent rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-black tracking-tight uppercase">Tối ưu phát sóng</h3>

            <div className="space-y-3">
              <label className="text-xs font-bold text-secondary uppercase">Độ trễ (Latency)</label>
              <div className="flex p-1 bg-accent rounded-xl border border-accent">
                {['normal', 'low', 'ultra'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLatency(l)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${latency === l ? "bg-background text-primary shadow-sm" : "text-secondary hover:text-foreground"}`}
                  >
                    {l === 'normal' ? 'Thường' : l === 'low' ? 'Thấp' : 'Cực thấp'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-accent">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold">Chế độ tua lại (DVR)</p>
                  <p className="text-[10px] text-secondary italic">Cho phép người xem tua lại</p>
                </div>
                <button onClick={() => setDvr(!dvr)}>
                  {dvr ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-secondary" />}
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold opacity-50">Lưu bản ghi (VOD)</p>
                  <p className="text-[10px] text-secondary italic opacity-50">Tự động lưu sau khi kết thúc</p>
                </div>
                <ToggleRight className="w-8 h-8 text-primary opacity-20 cursor-not-allowed" />
              </div>
            </div>

            <div className="p-4 bg-selection rounded-2xl flex gap-3 border border-primary/10">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-secondary italic">
                Để có chất lượng tốt nhất, hãy cấu hình Bitrate khoảng 4500-6000 Kbps trong phần mềm OBS.
              </p>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}