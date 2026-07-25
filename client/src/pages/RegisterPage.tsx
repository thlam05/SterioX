import { Button } from '@/components/ui/Button';
import { Navigate } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { PATHS } from '@/routes/paths';
import { useRegisterForm } from '@/hooks/auth/useRegisterForm';
import { NameField } from '@/components/auth/NameField';
import { EmailField } from '@/components/auth/EmailField';
import { PasswordField } from '@/components/auth/PasswordField';
import { TermsCheckbox } from '@/components/auth/TermsCheckbox';
import { FormAlert } from '@/components/auth/FormAlert';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

export default function RegisterPage() {
  const { isAuthenticated } = useAuthStore();
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    agreeTerms,
    setAgreeTerms,
    nameError,
    emailError,
    passwordError,
    agreeTermsError,
    registerError,
    handleSubmit,
  } = useRegisterForm();

  if (isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return (
    <div className="bg-background border border-accent rounded-2xl p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <NameField value={name} onChange={setName} error={nameError} />

        <EmailField value={email} onChange={setEmail} error={emailError} />

        <PasswordField
          value={password}
          onChange={setPassword}
          error={passwordError}
          showPassword={showPassword}
          onToggleShow={() => setShowPassword(!showPassword)}
          placeholder="Tối thiểu 6 ký tự"
          showForgotPassword={false}
        />

        <TermsCheckbox
          checked={agreeTerms}
          onChange={setAgreeTerms}
          error={agreeTermsError}
        />

        {registerError && <FormAlert message={registerError} />}

        <Button type="submit" variant="primary" className="w-full mt-2">
          Đăng ký tài khoản
        </Button>
        
        <SocialLoginButtons action="Đăng ký" />
      </form>
    </div>
  );
}
