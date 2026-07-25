import { Code, Gamepad2, Music, MonitorPlay } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CategoryItem = {
  name: string;
  count: string;
  icon: LucideIcon;
  bgEmoji: string;
  color: string;
};

export const categories: CategoryItem[] = [
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
