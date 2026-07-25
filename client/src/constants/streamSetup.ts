import { Globe, Link2, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const STREAM_STATUS = {
  PUBLIC: 'PUBLIC',
  UNLISTED: 'UNLISTED',
  PRIVATE: 'PRIVATE',
} as const;

export const STREAM_LATENCY = {
  NORMAL: 'NORMAL',
  LOW: 'LOW',
  ULTRA: 'ULTRA',
} as const;

export type PrivacyOption = {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
};

export const PRIVACY_OPTIONS: PrivacyOption[] = [
  { id: STREAM_STATUS.PUBLIC, label: 'Công khai', desc: 'Ai cũng thấy', icon: Globe },
  { id: STREAM_STATUS.UNLISTED, label: 'Không công khai', desc: 'Chỉ người có link', icon: Link2 },
  { id: STREAM_STATUS.PRIVATE, label: 'Riêng tư', desc: 'Chỉ mình bạn', icon: Lock },
];

export const LATENCY_LABELS: Record<string, string> = {
  [STREAM_STATUS.PUBLIC]: 'Thường',
  [STREAM_LATENCY.LOW]: 'Thấp',
  [STREAM_LATENCY.ULTRA]: 'Cực thấp',
};

export const THUMBNAIL_MAX_SIZE = 5 * 1024 * 1024;
