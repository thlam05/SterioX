import { Input } from '@/components/ui/Input';

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showPassword: boolean;
  onToggleShow: () => void;
  placeholder?: string;
  showForgotPassword?: boolean;
};

export function PasswordField({
  value,
  onChange,
  error,
  showPassword,
  onToggleShow,
  placeholder = 'Nhập mật khẩu của bạn',
  showForgotPassword = true,
}: PasswordFieldProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-xs font-black tracking-wider text-foreground">
          Mật khẩu
        </label>
        {showForgotPassword && (
          <a
            href="#"
            className="text-xs text-primary font-bold hover:underline"
          >
            Quên mật khẩu?
          </a>
        )}
      </div>
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          error={!!error}
          onChange={(e) => onChange(e.target.value)}
          className="pr-12"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-secondary hover:text-foreground focus:outline-none select-none"
        >
          {showPassword ? 'Ẩn' : 'Hiện'}
        </button>
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}
