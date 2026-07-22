import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { PATHS } from '@/routes/paths';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [agreeTermsError, setAgreeTermsError] = useState('');

  const [registerError, setRegisterError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    const isValid = validateSubmition();

    if (isValid) {
      authApi
        .register({ email, username: name, password })
        .then((data) => {
          login({ user: data.user, token: data.token, rememberMe: true });
          navigate(PATHS.HOME);
        })
        .catch((error) => {
          setRegisterError(
            error?.message || 'Đăng ký thất bại. Vui lòng thử lại sau.',
          );
        });
    }
  };

  const validateSubmition = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Họ và tên không được để trống.');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Họ và tên phải có ít nhất 2 ký tự.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Email không được để trống.');
      isValid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
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

    if (!agreeTerms) {
      setAgreeTermsError('Bạn phải đồng ý với điều khoản dịch vụ để tiếp tục.');
      isValid = false;
    } else {
      setAgreeTermsError('');
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
          Họ và tên
        </label>
        <Input
          type="text"
          placeholder="Nhập họ và tên của bạn"
          value={name}
          error={!!nameError}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && <p className="text-danger text-xs mt-1">{nameError}</p>}
      </div>

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
        <label className="block text-xs font-black tracking-wider mb-2 text-foreground">
          Mật khẩu
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            error={!!passwordError}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-secondary hover:text-foreground focus:outline-none"
          >
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
        </div>
        {passwordError && (
          <p className="text-danger text-xs mt-1">{passwordError}</p>
        )}
      </div>

      <div>
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-accent text-primary focus:ring-primary-light"
          />
          <label
            htmlFor="terms"
            className="text-xs text-secondary leading-relaxed"
          >
            Tôi đồng ý với{' '}
            <a href="#" className="underline text-foreground font-medium">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#" className="underline text-foreground font-medium">
              Chính sách bảo mật
            </a>{' '}
            của SterioX.
          </label>
        </div>
        {agreeTermsError && (
          <p className="text-danger text-xs mt-1">{agreeTermsError}</p>
        )}
      </div>

      {registerError && (
        <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {registerError}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full mt-2">
        Đăng ký tài khoản
      </Button>
    </form>
  );
}
