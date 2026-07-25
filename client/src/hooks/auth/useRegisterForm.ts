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

export function useRegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

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

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError(VALIDATION_MESSAGES.NAME_REQUIRED);
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError(VALIDATION_MESSAGES.NAME_MIN_LENGTH);
      isValid = false;
    } else {
      setNameError('');
    }

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

    if (!agreeTerms) {
      setAgreeTermsError(VALIDATION_MESSAGES.TERMS_REQUIRED);
      isValid = false;
    } else {
      setAgreeTermsError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!validate()) return;

    authApi
      .register({ email, username: name, password })
      .then((data) => {
        login({ user: data.user, token: data.token, rememberMe: true });
        navigate(PATHS.HOME);
      })
      .catch((error) => {
        setRegisterError(error?.message || API_ERROR_MESSAGES.REGISTER_FAILED);
      });
  };

  return {
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
  };
}
