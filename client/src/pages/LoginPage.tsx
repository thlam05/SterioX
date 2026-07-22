import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { PATHS } from '@/routes/paths';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const isValid = validateSubmition();

    if (isValid) {
      authApi
        .login({ email, password })
        .then((data) => {
          login({ user: data.user, token: data.token, rememberMe });
          navigate(PATHS.HOME);
        })
        .catch((error) => {
          setLoginError(
            error?.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.',
          );
        });
    }
  };

  const validateSubmition = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Email không được để trống.');
      isValid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      setEmailError('Email không hợp lệ.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Mật khẩu không được để trống.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  if (isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
          Địa chỉ Email
        </label>
        <Input
          type="text"
          placeholder="example@email.com"
          value={email}
          error={!!emailError}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="text-danger text-xs mt-1">{emailError}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-black tracking-wider text-foreground">
            Mật khẩu
          </label>
          <a
            href="#"
            className="text-xs text-primary font-bold hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu của bạn"
            value={password}
            error={!!passwordError}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-secondary hover:text-foreground focus:outline-none select-none"
          >
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
        </div>
        {passwordError && (
          <p className="text-danger text-xs mt-1">{passwordError}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-accent text-primary focus:ring-primary-light cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-xs text-secondary font-medium cursor-pointer select-none"
          >
            Ghi nhớ đăng nhập
          </label>
        </div>
      </div>

      {loginError && (
        <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {loginError}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full mt-2">
        Đăng nhập
      </Button>
    </form>
  );
}
