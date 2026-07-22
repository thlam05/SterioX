import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import {
  User,
  Sliders,
  Bell,
  ShieldCheck,
  Moon,
  Languages,
  Volume2,
  Lock,
  Smartphone,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/api/userApi';

export default function SettingsContent() {
  const { user, updateUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState('profile');

  const [newUsername, setNewUsername] = useState(user?.username ?? '');
  const [newEmail, setNewEmail] = useState(user?.email ?? '');
  const [profileError, setProfileError] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [notifyLive, setNotifyLive] = useState(true);
  const [notifyChat, setNotifyChat] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
    { id: 'display', label: 'Giao diện & Hiển thị', icon: Sliders },
    { id: 'notify', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật tài khoản', icon: ShieldCheck },
  ];

  const isProfileChanged =
    newUsername !== (user?.username ?? '') || newEmail !== (user?.email ?? '');

  useEffect(() => {
    setNewUsername(user?.username ?? '');
    setNewEmail(user?.email ?? '');
  }, [user]);

  const handleCancelChanges = () => {
    setNewUsername(user?.username ?? '');
    setNewEmail(user?.email ?? '');
    setProfileError('');
  };

  const handleUpdateProfile = async () => {
    if (!user || !isProfileChanged || isUpdatingProfile) return;

    setProfileError('');
    setIsUpdatingProfile(true);

    try {
      const updatedUser = await userApi.updateUser(user.id, {
        username: newUsername,
        email: newEmail,
        avatarImageUrl: user.avatarImageUrl,
        roles: user.roles,
      });

      updateUser(updatedUser);
    } catch (error) {
      console.log(error);
      setProfileError(
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Cập nhật hồ sơ thất bại. Vui lòng thử lại sau.',
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="w-full bg-background text-foreground font-sans space-y-8 md:space-y-10 overflow-x-hidden">
      {/* Tiêu đề trang chính giống cấu trúc tiêu đề của HomePage */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          <h3 className="text-xl font-extrabold tracking-tight">
            Cài đặt tài khoản
          </h3>
        </div>
      </div>

      {/* Bố cục lưới chia vùng cài đặt giống phong cách lưới của HomePage */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-auto">
        <aside className="lg:col-span-1 flex flex-row lg:flex-col gap-1.5 bg-background border border-accent p-3 rounded-2xl h-fit overflow-x-auto lg:overflow-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border text-left ${
                  isActive
                    ? 'bg-selection text-primary border-primary'
                    : 'bg-transparent text-secondary border-transparent hover:bg-accent hover:text-foreground'
                } shrink-0 lg:shrink`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-secondary'}`}
                />
                {tab.label}
              </button>
            );
          })}
        </aside>

        <div className="lg:col-span-3 bg-background border border-accent rounded-2xl p-4 sm:p-6 space-y-8 min-w-0">
          {/* Tab 1: Hồ sơ cá nhân */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-foreground">
                  Hồ sơ cá nhân
                </h4>
                <p className="text-xs text-secondary mt-1">
                  Cập nhật thông tin công khai hiển thị trên kênh trực tuyến cá
                  nhân của bạn.
                </p>
              </div>

              <div className="border-t border-accent pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-accent border border-accent p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center text-xl font-black shrink-0">
                    <img
                      src={user?.avatarImageUrl}
                      alt={user?.username || 'Avatar'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-foreground">
                      Ảnh đại diện kênh
                    </h5>
                    <p className="text-[11px] text-secondary">
                      Hỗ trợ định dạng png hoặc jpg, dung lượng tối đa là 2mb.
                    </p>
                  </div>
                  <div className="sm:ml-auto flex flex-col xs:flex-row sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      variant="primary"
                      className="text-xs font-bold py-1.5 px-3 rounded-lg flex-1 sm:flex-none"
                    >
                      Tải ảnh mới
                    </Button>
                    <Button
                      variant="outline"
                      className="text-xs font-bold py-1.5 px-3 border-accent text-danger rounded-lg flex-1 sm:flex-none"
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-foreground">
                      Tên hiển thị người dùng
                    </label>
                    <Input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder={'example'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-foreground">
                      Địa chỉ email liên hệ
                    </label>
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                {/* <div className="space-y-2">
                  <label className="block text-xs font-bold text-foreground">Tiểu sử ngắn xuất hiện trên kênh</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-accent text-foreground rounded-xl text-sm font-medium focus:outline-none focus:border-primary placeholder:text-secondary resize-none"
                    defaultValue="Sinh viên năm 3 khoa công nghệ phần mềm tại hcmus. đam mê phát triển hệ thống backend, java spring boot và cấu hình docker đa dịch vụ."
                  />
                </div> */}

                {profileError && (
                  <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                    {profileError}
                  </p>
                )}
              </div>

              <div className="border-t border-accent pt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                <Button
                  variant="outline"
                  className="text-xs font-bold border-accent px-4 py-2 rounded-xl w-full sm:w-auto"
                  disabled={!isProfileChanged || isUpdatingProfile}
                  onClick={handleCancelChanges}
                >
                  Hủy bỏ thay đổi
                </Button>
                <Button
                  variant="primary"
                  className="text-xs font-bold px-4 py-2 rounded-xl w-full sm:w-auto"
                  disabled={!isProfileChanged || isUpdatingProfile}
                  onClick={handleUpdateProfile}
                >
                  {isUpdatingProfile ? 'Đang lưu...' : 'Lưu cấu hình hệ thống'}
                </Button>
              </div>
            </div>
          )}

          {/* Tab 3: Giao diện & Hiển thị */}
          {activeTab === 'display' && (
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-accent border border-accent rounded-xl">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-foreground" />
                    <div>
                      <h5 className="text-xs font-bold text-foreground">
                        Kích hoạt chế độ giao diện tối
                      </h5>
                      <p className="text-[11px] text-secondary">
                        Tối ưu hóa năng lượng và bảo vệ mắt ban đêm.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-success bg-background px-2.5 py-1 rounded-full border border-accent">
                    Đang sử dụng
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-accent border border-accent rounded-xl">
                  <div className="flex items-center gap-3">
                    <Languages className="w-5 h-5 text-foreground" />
                    <div>
                      <h5 className="text-xs font-bold text-foreground">
                        Ngôn ngữ hiển thị hệ thống
                      </h5>
                      <p className="text-[11px] text-secondary">
                        Thay đổi ngôn ngữ cho toàn bộ nhãn giao diện.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="text-xs font-bold border-accent py-1 h-7"
                  >
                    Tiếng Việt
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-accent border border-accent rounded-xl">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-foreground" />
                    <div>
                      <h5 className="text-xs font-bold text-foreground">
                        Âm thanh phản hồi tương tác
                      </h5>
                      <p className="text-[11px] text-secondary">
                        Phát cảnh báo nhỏ khi nhận tin nhắn hoặc quà mới.
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-primary rounded-full p-0.5 cursor-pointer flex justify-end items-center">
                    <div className="w-4 h-4 rounded-full bg-background"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Thông báo */}
          {activeTab === 'notify' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-foreground">
                  Cài đặt thông báo
                </h4>
                <p className="text-xs text-secondary mt-1">
                  Lựa chọn cách thức nhận thông tin cập nhật từ hệ thống trực
                  tuyến.
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
                  <input
                    type="checkbox"
                    checked={notifyLive}
                    onChange={(e) => setNotifyLive(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-accent text-primary focus:ring-primary"
                  />
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
                  <input
                    type="checkbox"
                    checked={notifyChat}
                    onChange={(e) => setNotifyChat(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-accent text-primary focus:ring-primary"
                  />
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
                    defaultChecked={true}
                    className="mt-1 h-4 w-4 rounded border-accent text-primary focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Bảo mật tài khoản */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-foreground">
                  Bảo mật tài khoản
                </h4>
                <p className="text-xs text-secondary mt-1">
                  Kích hoạt các tầng bảo vệ tối cao ngăn chặn truy cập trái
                  phép.
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
                        Cập nhật mật khẩu định kỳ để nâng cao tính an toàn thông
                        tin cá nhân.
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
                        Yêu cầu nhập mã otp bảo mật từ điện thoại khi đăng nhập
                        thiết bị lạ.
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
                      Trình duyệt web chrome chạy trên nền tảng hệ điều hành
                      windows - thành phố hồ chí minh, việt nam.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
