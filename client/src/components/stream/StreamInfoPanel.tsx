import { Button } from '@/components/ui/Button';
import { Heart, Gift, Share2, Award } from 'lucide-react';

type StreamInfoPanelProps = {
  tags: string[];
  isFollowed: boolean;
  isLiked: boolean;
  onToggleFollow: () => void;
  onLike: () => void;
};

export function StreamInfoPanel({
  tags,
  isFollowed,
  isLiked,
  onToggleFollow,
  onLike,
}: StreamInfoPanelProps) {
  return (
    <div className="bg-background border border-accent rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={isFollowed ? 'outline' : 'primary'}
            onClick={onToggleFollow}
            className="font-bold flex items-center gap-2 px-5"
          >
            {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
          </Button>

          <Button
            variant={isLiked ? 'outline' : 'primary'}
            onClick={onLike}
            className="font-bold flex items-center gap-2 px-5"
          >
            <Heart className="w-4 h-4" />
            {isLiked ? 'Đã thích' : 'Thích'}
          </Button>

          <Button
            variant="outline"
            className="font-bold flex items-center gap-2 border-accent"
          >
            <Gift className="w-4 h-4 text-warning fill-warning/20" /> Tặng quà
          </Button>

          <Button
            variant="outline"
            className="p-2 border-accent text-secondary hover:text-foreground"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <hr className="border-accent" />

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
  );
}
