import { ToggleSwitch } from '@/components/settings/ToggleSwitch';

type NotificationsTabProps = {
  notifyLive: boolean;
  onNotifyLiveChange: (checked: boolean) => void;
  notifyChat: boolean;
  onNotifyChatChange: (checked: boolean) => void;
};

export function NotificationsTab({
  notifyLive,
  onNotifyLiveChange,
  notifyChat,
  onNotifyChatChange,
}: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-bold text-foreground">
          Cài đặt thông báo
        </h4>
        <p className="text-xs text-secondary mt-1">
          Lựa chọn cách thức nhận thông tin cập nhật từ hệ thống trực tuyến.
        </p>
      </div>

      <div className="border-t border-accent pt-6 space-y-4">
        <div className="flex items-start justify-between gap-4 p-2 border-b border-accent pb-4">
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-foreground">
              Thông báo đẩy khi thần tượng bắt đầu livestream
            </h5>
            <p className="text-[11px] text-secondary">
              Nhận cảnh báo trực tiếp trên thanh trạng thái thiết bị.
            </p>
          </div>
          <ToggleSwitch checked={notifyLive} onChange={onNotifyLiveChange} />
        </div>

        <div className="flex items-start justify-between gap-4 p-2 border-b border-accent pb-4">
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-foreground">
              Thông báo khi có tin nhắn hộp thư riêng biệt
            </h5>
            <p className="text-[11px] text-secondary">
              Gửi tin báo lập tức khi người xem trao đổi trực tiếp.
            </p>
          </div>
          <ToggleSwitch checked={notifyChat} onChange={onNotifyChatChange} />
        </div>

        <div className="flex items-start justify-between gap-4 p-2">
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-foreground">
              Bản tin cập nhật tính năng định kỳ hàng tuần
            </h5>
            <p className="text-[11px] text-secondary">
              Gửi danh sách tổng hợp công nghệ mới qua email liên hệ.
            </p>
          </div>
          <input
            type="checkbox"
            defaultChecked
            className="mt-1 h-4 w-4 rounded border-accent text-primary focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}
