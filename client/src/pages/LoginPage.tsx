import { Button } from '@/components/ui/Button';
import { Navigate } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { PATHS } from '@/routes/paths';
import { useLoginForm } from '@/hooks/auth/useLoginForm';
import { EmailField } from '@/components/auth/EmailField';
import { PasswordField } from '@/components/auth/PasswordField';
import { RememberMeCheckbox } from '@/components/auth/RememberMeCheckbox';
import { FormAlert } from '@/components/auth/FormAlert';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    loginError,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleSubmit,
  } = useLoginForm();

  if (isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return (
    <div className="bg-background border border-accent rounded-2xl p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <EmailField value={email} onChange={setEmail} error={emailError} />

        <PasswordField
          value={password}
          onChange={setPassword}
          error={passwordError}
          showPassword={showPassword}
          onToggleShow={() => setShowPassword(!showPassword)}
        />

        <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />

        {loginError && <FormAlert message={loginError} />}

        <Button type="submit" variant="primary" className="w-full mt-2">
          Đăng nhập
        </Button>

        <SocialLoginButtons action="Đăng nhập" />
      </form>
    </div>
  );
}
