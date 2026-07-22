import Logo from '@/components/ui/Logo';
import { Link, useLocation } from 'react-router';
import { PATHS } from '@/routes/paths';
import { Button } from '@/components/ui/Button';

export default function AuthHeader() {
  const { pathname } = useLocation();

  const isLogin = pathname === PATHS.AUTH.LOGIN;

  return (
    <header className="px-6 py-3 md:px-12 border-b border-accent flex justify-between items-center bg-background">
      <Logo />
      <div className="flex items-center gap-3">
        {isLogin ? (
          <>
            <Link to={PATHS.AUTH.LOGIN}>
              <Button>Đăng nhập</Button>
            </Link>
            <Link to={PATHS.AUTH.REGISTER}>
              <Button variant="outline">Đăng ký</Button>
            </Link>
          </>
        ) : (
          <>
            <Link to={PATHS.AUTH.LOGIN}>
              <Button variant="outline">Đăng nhập</Button>
            </Link>
            <Link to={PATHS.AUTH.REGISTER}>
              <Button>Đăng ký</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
