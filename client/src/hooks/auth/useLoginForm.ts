import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { PATHS } from '@/routes/paths';
import {
  EMAIL_REGEX,
  VALIDATION_MESSAGES,
  API_ERROR_MESSAGES,
} from '@/constants/validation';

export function useLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validate = () => {
    let isValid = true;

    if (!email) {
      setEmailError(VALIDATION_MESSAGES.EMAIL_REQUIRED);
      isValid = false;
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError(VALIDATION_MESSAGES.EMAIL_INVALID);
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH);
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validate()) return;

    authApi
      .login({ email, password })
      .then((data) => {
        login({ user: data.user, token: data.token, rememberMe });
        navigate(PATHS.HOME);
      })
      .catch((error) => {
        setLoginError(error?.message || API_ERROR_MESSAGES.LOGIN_FAILED);
      });
  };

  return {
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
  };
}
