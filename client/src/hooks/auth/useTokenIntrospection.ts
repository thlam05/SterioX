import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/authApi';
import type { TokenResponse } from '@/types/authType';

export function useTokenIntrospection() {
  const { token, logout, setToken } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    const introspectToken = async () => {
      try {
        const valid = await authApi.introspect(token);

        if (!valid) {
          try {
            const tokenResponse: TokenResponse = await authApi.refresh(token);
            setToken(tokenResponse.accessToken);
          } catch (err) {
            console.log(err);
            logout();
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    introspectToken();
  }, [token, logout, setToken]);
}
