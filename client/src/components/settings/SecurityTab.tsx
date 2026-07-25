import { Button } from '@/components/ui/Button';
import { Lock, Smartphone } from 'lucide-react';

export function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-bold text-foreground">
          Bảo mật tài khoản
        </h4>
        <p className="text-xs text-secondary mt-1">
          Kích hoạt các tầng bảo vệ tối cao ngăn chặn truy cập trái phép.
        </p>
      </div>

      <div className="border-t border-accent pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-accent rounded-xl gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-foreground" />
            <div>
              <h5 className="text-xs font-bold text-foreground">
                Mật khẩu đăng nhập hệ thống
              </h5>
              <p className="text-[11px] text-secondary">
                Cập nhật mật khẩu định kỳ để nâng cao tính an toàn thông tin cá
                nhân.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-xs font-bold border-accent px-4 py-1.5 h-8 rounded-lg self-start sm:self-auto"
          >
            Thay đổi mật khẩu
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-accent rounded-xl gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-foreground" />
            <div>
              <h5 className="text-xs font-bold text-foreground">
                Xác thực hai yếu tố bảo mật bảo vệ tài khoản (2FA)
              </h5>
              <p className="text-[11px] text-secondary">
                Yêu cầu nhập mã otp bảo mật từ điện thoại khi đăng nhập thiết bị
                lạ.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            className="text-xs font-bold px-4 py-1.5 h-8 rounded-lg self-start sm:self-auto"
          >
            Kích hoạt bảo vệ
          </Button>
        </div>

        <div className="p-4 bg-warning border border-accent rounded-xl flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-foreground mt-1.5 shrink-0"></div>
          <div className="space-y-0.5">
            <h6 className="text-xs font-bold text-foreground">
              Thiết bị đang kết nối hiện tại
            </h6>
            <p className="text-[11px] text-secondary">
              Trình duyệt web chrome chạy trên nền tảng hệ điều hành windows -
              thành phố hồ chí minh, việt nam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
