import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import { useState } from "react";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-background text-foregound flex flex-col justify-between font-sans selection:bg-selection">
      {/* Header */}
      <header className="px-6 py-4 md:px-12 border-b border-secondary flex justify-between items-center bg-white">
        <Logo></Logo>
        <div className="hidden md:flex items-center space-x-4 text-sm font-bold">
          <span className="text-accent">Chưa có tài khoản?</span>
          <Button variant="primary">
            Đăng ký
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-[480px] bg-white border border-foreground md:border-2 md:border-foreground rounded-3xl p-6 md:p-10">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              Đăng nhập để tiếp tục học
            </h1>
            <p className="text-sm md:text-base text-accent">
              Chào mừng bạn trở lại. Hãy tham gia vào các buổi livestream thú vị cho bạn hôm nay.
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              className="w-full py-3 border-2 border-foreground bg-white text-foreground hover:bg-primary-light font-bold rounded-xl flex items-center justify-center gap-3 transition-colors duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Tiếp tục với Google
            </Button>

            <Button
              className="w-full py-3 border-2 border-foreground bg-primary text-white hover:bg-primary-light font-bold rounded-xl flex items-center justify-center gap-3 transition-colors duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Tiếp tục với Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-secondary"></div>
            <span className="px-4 text-xs font-bold text-accent uppercase tracking-widest">Hoặc bằng Email</span>
            <div className="flex-grow border-t border-secondary"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2 text-foreground">
                Địa chỉ Email
              </label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-foreground">
                  Mật khẩu
                </label>
                <a href="#" className="text-xs font-bold text-accent hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-accent hover:text-foreground focus:outline-none"
                >
                  {showPassword ? 'Ẩn' : ""}
                </button>
              </div>
            </div>

            {/* Terms Notice */}
            <p className="text-xs text-accent leading-relaxed pt-1">
              Bằng việc đăng nhập, bạn đồng ý với{' '}
              <a href="#" className="underline text-foreground font-medium">Điều khoản dịch vụ</a>{' '}
              và{' '}
              <a href="#" className="underline text-foreground font-medium">Chính sách bảo mật</a> của chúng tôi.
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
            >
              Đăng nhập
            </Button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-secondary text-center text-xs text-accent bg-white">
        © 2026 SterioX Inc. Giao diện thiết kế chuẩn mực học tập toàn cầu.
      </footer>
    </div>
  )
}