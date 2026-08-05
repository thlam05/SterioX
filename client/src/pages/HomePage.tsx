import { useState } from "react";
import {
  Flame,
  Heart,
  SlidersHorizontal,
  Compass,
  Eye,
  Radio,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Banner, type LiveStreamItem } from "@/components/features/home/Banner";

interface Category {
  id: string;
  name: string;
  icon?: string;
}

const CATEGORIES: Category[] = [
  { id: "all", name: "Tất cả" },
  { id: "gaming", name: "Gaming" },
  { id: "chat", name: "Trò chuyện" },
  { id: "music", name: "Âm nhạc" },
  { id: "beauty", name: "Làm đẹp" },
  { id: "tech", name: "Công nghệ" },
  { id: "eating", name: "Mukbang" },
];

const MOCK_STREAMS: LiveStreamItem[] = [
  {
    id: "1",
    title: "Tâm sự đêm khuya cùng mọi người",
    description: "lorem Tâm sự đêm khuya cùng mọi người",
    streamer: {
      id: "s1",
      name: "Minh Anh Live",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
    },
    category: "Trò chuyện",
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    viewerCount: 12450,
    isLive: true,
    tags: ["TâmSự", "Chill", "Interactive"],
  },
  {
    id: "2",
    title: "Đột kích Rank Cao Thủ - Trận chung kết giải đấu mùa xuân 🏆",
    streamer: {
      id: "s2",
      name: "ProGamer_VN",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
    },
    category: "Gaming",
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    viewerCount: 8920,
    isLive: true,
    tags: ["Esports", "Ranked", "FPS"],
  },
  {
    id: "3",
    title: "Hướng dẫn Makeup đi tiệc tone Hồng Phấn cực xinh ✨",
    streamer: {
      id: "s3",
      name: "Thảo Nhi Beauty",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    category: "Làm đẹp",
    thumbnail:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    viewerCount: 3410,
    isLive: true,
    tags: ["Makeup", "Tutorial", "Lifestyle"],
  },
  {
    id: "4",
    title: "Acoustic Night - Yêu cầu bài hát nhận ngay phần quà bí mật 🎸",
    streamer: {
      id: "s4",
      name: "Hoàng Band",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    category: "Âm nhạc",
    thumbnail:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    viewerCount: 5600,
    isLive: true,
    tags: ["Acoustic", "LiveMusic", "Vocal"],
  },
  {
    id: "5",
    title: "Review Siêu Máy Tính AI Mới Nhất - Q&A Trực Tiếp 💻",
    streamer: {
      id: "s5",
      name: "TechMaster",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      isVerified: true,
    },
    category: "Công nghệ",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    viewerCount: 1890,
    isLive: true,
    tags: ["Review", "Tech", "AI"],
  },
  {
    id: "6",
    title: "Mukbang Hải Sản Siêu Khổng Lồ - Trò Chuyện Cùng Fan 🦀",
    streamer: {
      id: "s6",
      name: "Foodie Linh",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    },
    category: "Mukbang",
    thumbnail:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    viewerCount: 7200,
    isLive: true,
    tags: ["Mukbang", "Seafood", "Eating"],
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredStreams = MOCK_STREAMS.filter((stream) => {
    const matchesCategory =
      selectedCategory === "all" ||
      stream.category.toLowerCase() ===
        CATEGORIES.find((c) => c.id === selectedCategory)?.name.toLowerCase();
    const matchesSearch =
      stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.streamer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredStream = MOCK_STREAMS[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-8">
        {/* Featured Hero Banner */}
        {featuredStream && !searchQuery && selectedCategory === "all" && (
          <Banner stream={featuredStream} />
        )}

        {/* Category Filter Horizontal Scroll */}
        <section className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-accent/70 hover:bg-accent text-secondary hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            className="hidden md:flex text-secondary hover:text-foreground shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </section>

        {/* Live Streams Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">
                {selectedCategory === "all"
                  ? "Luồng Nổi Bật"
                  : `Kênh ${CATEGORIES.find((c) => c.id === selectedCategory)?.name}`}
              </h2>
            </div>
            <span className="text-xs text-secondary font-medium">
              {filteredStreams.length} phòng đang phát
            </span>
          </div>

          {filteredStreams.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-accent/20 rounded-2xl border border-dashed border-border">
              <Compass className="w-10 h-10 text-secondary mx-auto" />
              <p className="text-secondary font-medium">
                Không tìm thấy phòng stream phù hợp
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStreams.map((stream) => (
                <article
                  key={stream.id}
                  className="group flex flex-col bg-accent/20 border border-border/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300"
                >
                  {/* Thumbnail Wrapper */}
                  <div className="relative aspect-video w-full overflow-hidden bg-accent">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* LIVE Status Badge */}
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Live
                    </div>

                    {/* Viewer Counter */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                      <Eye className="w-3 h-3 text-primary" />
                      {stream.viewerCount.toLocaleString()}
                    </div>

                    {/* Overlay Play Action */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Radio className="w-6 h-6 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-snug">
                        {stream.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={stream.streamer.avatar}
                          alt={stream.streamer.name}
                          className="w-8 h-8 rounded-full object-cover border border-primary/40"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-foreground flex items-center gap-1">
                            {stream.streamer.name}
                            {stream.streamer.isVerified && (
                              <UserCheck className="w-3 h-3 text-primary" />
                            )}
                          </span>
                          <span className="text-[10px] text-secondary">
                            {stream.category}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-secondary hover:text-primary hover:bg-primary-light/50 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
