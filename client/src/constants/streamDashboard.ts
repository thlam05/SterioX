import { Radio, Users, Heart, Clock, Activity, Tv } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type StatItem = {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
  isActive?: boolean;
};

export const STREAM_STATS: StatItem[] = [
  {
    icon: Radio,
    iconColor: 'text-danger',
    label: 'Trạng thái',
    value: 'Ngoại tuyến',
    isActive: false,
  },
  {
    icon: Users,
    iconColor: 'text-info',
    label: 'Người xem',
    value: 0,
  },
  {
    icon: Heart,
    iconColor: 'text-primary',
    label: 'Lượt thích',
    value: 0,
  },
  {
    icon: Clock,
    iconColor: 'text-warning',
    label: 'Thời gian phát',
    value: '--:--:--',
  },
  {
    icon: Activity,
    iconColor: 'text-success',
    label: 'Tốc độ bit',
    value: '-- Kbps',
  },
  {
    icon: Tv,
    iconColor: 'text-foreground',
    label: 'Độ phân giải',
    value: '--',
  },
];
