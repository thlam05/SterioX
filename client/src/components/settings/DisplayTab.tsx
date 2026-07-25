import { Button } from '@/components/ui/Button';
import { SettingRow } from '@/components/settings/SettingRow';
import { Moon, Languages, Volume2 } from 'lucide-react';

export function DisplayTab() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-bold text-foreground">
          Giao diện & Hiển thị
        </h4>
        <p className="text-xs text-secondary mt-1">
          Tùy biến môi trường hiển thị phù hợp với thị lực cá nhân.
        </p>
      </div>

      <div className="border-t border-accent pt-6 space-y-4">
        <SettingRow
          icon={<Moon className="w-5 h-5 text-foreground" />}
          title="Kích hoạt chế độ giao diện tối"
          description="Tối ưu hóa năng lượng và bảo vệ mắt ban đêm."
          action={
            <span className="text-xs font-bold text-success bg-background px-2.5 py-1 rounded-full border border-accent">
              Đang sử dụng
            </span>
          }
        />

        <SettingRow
          icon={<Languages className="w-5 h-5 text-foreground" />}
          title="Ngôn ngữ hiển thị hệ thống"
          description="Thay đổi ngôn ngữ cho toàn bộ nhãn giao diện."
          action={
            <Button
              variant="outline"
              className="text-xs font-bold border-accent py-1 h-7"
            >
              Tiếng Việt
            </Button>
          }
        />

        <SettingRow
          icon={<Volume2 className="w-5 h-5 text-foreground" />}
          title="Âm thanh phản hồi tương tác"
          description="Phát cảnh báo nhỏ khi nhận tin nhắn hoặc quà mới."
          action={
            <div className="w-10 h-5 bg-primary rounded-full p-0.5 cursor-pointer flex justify-end items-center">
              <div className="w-4 h-4 rounded-full bg-background"></div>
            </div>
          }
        />
      </div>
    </div>
  );
}
