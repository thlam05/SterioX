import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormAlert } from '@/components/auth/FormAlert';
import { useAuthStore } from '@/stores/authStore';

type ProfileTabProps = {
  newUsername: string;
  onUsernameChange: (value: string) => void;
  newEmail: string;
  onEmailChange: (value: string) => void;
  profileError: string;
  isProfileChanged: boolean;
  isUpdatingProfile: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export function ProfileTab({
  newUsername,
  onUsernameChange,
  newEmail,
  onEmailChange,
  profileError,
  isProfileChanged,
  isUpdatingProfile,
  onCancel,
  onSave,
}: ProfileTabProps) {
  const { user } = useAuthStore();

  return (
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
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="example"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-foreground">
              Địa chỉ email liên hệ
            </label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="example@email.com"
            />
          </div>
        </div>

        {profileError && <FormAlert message={profileError} />}
      </div>

      <div className="border-t border-accent pt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
        <Button
          variant="outline"
          className="text-xs font-bold border-accent px-4 py-2 rounded-xl w-full sm:w-auto"
          disabled={!isProfileChanged || isUpdatingProfile}
          onClick={onCancel}
        >
          Hủy bỏ thay đổi
        </Button>
        <Button
          variant="primary"
          className="text-xs font-bold px-4 py-2 rounded-xl w-full sm:w-auto"
          disabled={!isProfileChanged || isUpdatingProfile}
          onClick={onSave}
        >
          {isUpdatingProfile ? 'Đang lưu...' : 'Lưu cấu hình hệ thống'}
        </Button>
      </div>
    </div>
  );
}
