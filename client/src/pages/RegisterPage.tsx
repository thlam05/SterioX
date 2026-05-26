import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import { useState } from "react";
import { Link } from "react-router";
import { authApi } from "@/api/authApi";
import { type UserResponse } from "@/api/userApi";
import { useAuthStore } from "@/stores/authStore";

export default function RegisterPage() {
  const { login } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // States quản lý lỗi validate
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [agreeTermsError, setAgreeTermsError] = useState("");

  const [registerError, setRegisterError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    const isValid = validateSubmition();

    if (isValid) {
      let token: string = "";
      let user: UserResponse | null = null;
      authApi.register({ email, username: name, password })
        .then((data) => {
          token = data.token;
          user = data.user;
          login({ user, token, rememberMe: true });
        })
        .catch((error) => {
          setRegisterError(
            error?.message || "Đăng ký thất bại. Vui lòng thử lại sau.",
          );
        });
    }
  };

  const validateSubmition = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Họ và tên không được để trống.");
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError("Họ và tên phải có ít nhất 2 ký tự.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError("Email không được để trống.");
      isValid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      setEmailError("Email không hợp lệ.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Mật khẩu không được để trống.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!agreeTerms) {
      setAgreeTermsError("Bạn phải đồng ý với điều khoản dịch vụ để tiếp tục.");
      isValid = false;
    } else {
      setAgreeTermsError("");
    }

    return isValid;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans selection:bg-selection">
      {/* Header */}
      <header className="px-6 py-4 md:px-12 border-b border-accent flex justify-between items-center bg-background">
        <Logo />
        <div className="hidden md:flex items-center space-x-4 text-sm font-bold">
          <span className="text-secondary">Đã có tài khoản?</span>
          <Link to="/login">
            <Button variant="outline">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-[480px] bg-background border border-foreground rounded-3xl p-6 md:p-10">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-foreground">
              Tạo tài khoản SterioX
            </h1>
            <p className="text-sm md:text-base text-secondary">
              Tham gia cùng chúng tôi để trải nghiệm các buổi livestream công nghệ đỉnh cao mỗi ngày.
            </p>
          </div>

          {/* Social Register Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full py-3 border border-foreground bg-background text-foreground hover:bg-primary-light hover:text-foreground font-bold rounded-xl flex items-center justify-center gap-3 transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Đăng ký bằng Google
            </Button>

            <Button
              variant="outline"
              className="w-full py-3 bg-primary text-background hover:bg-primary-light hover:text-foreground font-bold rounded-xl flex items-center justify-center gap-3 transition-colors duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng ký bằng Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-accent"></div>
            <span className="px-4 text-xs font-bold text-secondary tracking-widest">Hoặc bằng Email</span>
            <div className="flex-grow border-t border-accent"></div>
          </div>

          {/* Register Form */}
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
              {passwordError && <p className="text-danger text-xs mt-1">{passwordError}</p>}
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-accent text-primary focus:ring-primary-light"
                />
                <label htmlFor="terms" className="text-xs text-secondary leading-relaxed">
                  Tôi đồng ý với{' '}
                  <a href="#" className="underline text-foreground font-medium">Điều khoản dịch vụ</a>{' '}
                  và{' '}
                  <a href="#" className="underline text-foreground font-medium">Chính sách bảo mật</a> của SterioX.
                </label>
              </div>
              {agreeTermsError && <p className="text-danger text-xs mt-1">{agreeTermsError}</p>}
            </div>

            {registerError && (
              <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {registerError}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
            >
              Đăng ký tài khoản
            </Button>
          </form>

          {/* Mobile Register Link */}
          <div className="mt-6 text-center text-sm md:hidden">
            <span className="text-secondary">Đã có tài khoản? </span>
            <Link to="/login" className="text-primary font-bold hover:underline">Đăng nhập</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-accent text-center text-xs text-secondary bg-background">
        © 2026 SterioX Inc. Giao diện thiết kế chuẩn mực học tập toàn cầu.
      </footer>
    </div>
  );
}
