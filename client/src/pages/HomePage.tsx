import { streamApi } from '@/api/streamApi';
import { Button } from '@/components/ui/Button';
import type { StreamResponse } from '@/types/streamType';
import {
  Flame,
  Eye,
  ChevronRight,
  TrendingUp,
  Gamepad2,
  Code,
  Music,
  MonitorPlay,
  MoreVertical,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PATHS } from '@/routes/paths';

export default function HomePage() {
  const [livestreams, setLivestreams] = useState<StreamResponse[]>([]);
  const [topLivestreams, setTopLivestream] = useState<StreamResponse[]>([]);
  const [regularLivestream, setRegularLivestream] = useState<StreamResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTopLivestreams = async () => {
      try {
        const livestreams = await streamApi.getTopStream();
        if (!abortController.signal.aborted) {
          setLivestreams(livestreams);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.log(error);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchTopLivestreams();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (!livestreams) return;

    setTopLivestream(livestreams.slice(0, 2));
    setRegularLivestream(livestreams.slice(2, 11));
  }, [livestreams]);

  const categories = [
    {
      name: 'Công nghệ & Đời sống',
      count: '12.4k đang xem',
      icon: Code,
      bgEmoji: '💻',
      color: 'text-primary',
    },
    {
      name: 'Giải đấu Trò chơi',
      count: '45.2k đang xem',
      icon: Gamepad2,
      bgEmoji: '🎮',
      color: 'text-info',
    },
    {
      name: 'Âm nhạc Trực tuyến',
      count: '8.9k đang xem',
      icon: Music,
      bgEmoji: '🎵',
      color: 'text-success',
    },
    {
      name: 'Học tập & Sáng tạo',
      count: '5.1k đang xem',
      icon: MonitorPlay,
      bgEmoji: '📚',
      color: 'text-warning',
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full bg-background text-foreground font-sans flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-background text-foreground font-sans space-y-10">
      {/* Bố cục lưới tổng thể điều chỉnh theo yêu cầu đề bài */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-auto">
        {/* Banner chiếm hết 1 hàng (4 cột trên md) và 2 ô dọc */}
        <section className="md:col-span-4 md:row-span-2 relative rounded-3xl bg-foreground text-background p-6 md:p-10 overflow-hidden flex flex-col justify-between min-h-[360px] border border-accent shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-30 md:opacity-100 flex items-center justify-center text-9xl select-none filter blur-sm">
            ✨
          </div>

          <div className="z-20 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-danger text-background px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              <Flame className="w-3.5 h-3.5" /> Sự kiện công nghệ lớn nhất năm
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-background">
              SterioX Developer Conference 2026
            </h2>
            <p className="text-sm md:text-base text-accent max-w-md leading-relaxed">
              Cập nhật những xu hướng công nghệ đột phá nhất, kết nối các lập
              trình viên xuất sắc và trải nghiệm không gian triển lãm ảo.
            </p>
          </div>

          <div className="z-20 flex flex-wrap items-center gap-4 pt-6">
            <div className="flex items-center gap-2 text-xs md:text-sm text-accent">
              <TrendingUp className="w-4 h-4 text-success" />{' '}
              <strong>45.9k</strong> người đang theo dõi sự kiện trực tiếp
            </div>
          </div>
        </section>

        {/* Tiêu đề phần Livestream view cao */}
        <div className="md:col-span-4 flex justify-between items-center pt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-danger rounded-full"></div>
            <h3 className="text-xl font-extrabold tracking-tight">
              Livestream xu hướng xem nhiều
            </h3>
          </div>
          <Button
            variant="outline"
            className="text-xs font-bold flex items-center gap-1 border-accent"
          >
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* 1 luồng Stream (video) view cao chiếm 2 ô ngang 1 ô dọc */}
        {topLivestreams.map((stream, index) => (
          <Link
            to={PATHS.STREAMS.DETAIL(stream.id)}
            key={index}
            className="md:col-span-2 md:row-span-1 group flex flex-col bg-background border border-accent rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="relative aspect-video bg-foreground overflow-hidden">
              <div className="absolute top-3 left-3 bg-danger text-background text-xs font-black px-2 py-0.5 rounded-md tracking-wider z-10">
                Live
              </div>
              <div className="absolute top-3 right-3 bg-foreground/80 text-background text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 z-10 backdrop-blur-sm">
                <Eye className="w-3.5 h-3.5 text-danger" /> {stream.totalViews}
              </div>
              <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 select-none overflow-hidden">
                <img
                  src={stream.thumbnail}
                  alt="Stream thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-4 flex gap-3 flex-1 bg-background">
              <div className="w-10 h-10 rounded-full bg-accent text-foreground flex items-center justify-center font-bold shrink-0 border border-primary">
                <img
                  src={stream.user?.avatarImageUrl}
                  alt={stream.user?.username || 'Avatar'}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors">
                  {stream.title}
                </h4>
                <p className="text-xs font-medium text-secondary">
                  {stream.user.username}
                </p>
                <div className="flex gap-1 pt-1">
                  {stream.categories.map((category, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-bold bg-selection text-primary px-2 py-0.5 rounded-md"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                className="p-1 border-none bg-transparent text-secondary hover:text-foreground h-8 w-8"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </Link>
        ))}

        {/* Tiêu đề phần Chuyên mục và Các livestream khác */}
        <div className="md:col-span-4 flex justify-between items-center pt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            <h3 className="text-xl font-extrabold tracking-tight">
              Khám phá theo chuyên mục
            </h3>
          </div>
          <Button
            variant="outline"
            className="text-xs font-bold flex items-center gap-1 border-accent"
          >
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Danh sách các Category: Mỗi category chiếm 2 ô dọc 1 ô ngang */}
        {categories.map((cat, index) => (
          <div
            key={index}
            className="md:col-span-1 md:row-span-2 group relative rounded-2xl border border-accent bg-background p-4 flex flex-col justify-between overflow-hidden hover:border-primary transition-all duration-200 min-h-[220px]"
          >
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:opacity-20 transition-opacity select-none">
              {cat.bgEmoji}
            </div>

            <div className="space-y-3 z-10">
              <div
                className={`w-10 h-10 rounded-xl bg-accent flex items-center justify-center ${cat.color}`}
              >
                <cat.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {cat.name}
                </h4>
                <p className="text-xs text-secondary mt-1">{cat.count}</p>
              </div>
            </div>

            <div className="z-10 pt-4">
              <Button
                variant="outline"
                className="w-full text-xs font-bold py-2 border-accent hover:bg-selection hover:text-primary rounded-xl transition-colors"
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        ))}

        {/* Tiêu đề cho các livestream khác */}
        <div className="md:col-span-4 flex justify-between items-center pt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-info rounded-full"></div>
            <h3 className="text-xl font-extrabold tracking-tight">
              Các buổi livestream đang diễn ra
            </h3>
          </div>
          <Button
            variant="outline"
            className="text-xs font-bold flex items-center gap-1 border-accent"
          >
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Các livestream khác xếp theo lưới tiêu chuẩn của hàng nội dung */}
        {regularLivestream.map((stream, index) => (
          <Link
            to={PATHS.STREAMS.DETAIL(stream.id)}
            key={index}
            className="md:col-span-1 group flex flex-col bg-background border border-accent rounded-2xl overflow-hidden hover:border-secondary transition-all duration-200"
          >
            <div className="relative aspect-video bg-foreground overflow-hidden">
              <div className="absolute top-2 left-2 bg-secondary text-background text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                Đang phát
              </div>
              <div className="absolute top-2 right-2 bg-foreground/60 text-background text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <Eye className="w-3 h-3 text-info" /> {stream.totalViews}
              </div>
              <div className="w-full h-full flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300 select-none">
                {stream.thumbnail}
              </div>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between space-y-2 bg-background">
              <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {stream.title}
              </h4>
              <p className="text-[11px] font-medium text-secondary truncate">
                {stream.user.username}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
