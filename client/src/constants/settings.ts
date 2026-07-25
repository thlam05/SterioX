import { User, Sliders, Bell, ShieldCheck } from 'lucide-react';

export type TabItem = {
  id: string;
  label: string;
  icon: typeof User;
};

export const SETTINGS_TABS: TabItem[] = [
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
  { id: 'display', label: 'Giao diện & Hiển thị', icon: Sliders },
  { id: 'notify', label: 'Thông báo', icon: Bell },
  { id: 'security', label: 'Bảo mật tài khoản', icon: ShieldCheck },
];

export const PROFILE_UPDATE_ERROR =
  'Cập nhật hồ sơ thất bại. Vui lòng thử lại sau.';
