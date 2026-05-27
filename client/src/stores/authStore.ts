import type { UserResponse } from "@/api/userApi";
import { create } from "zustand";

type AuthState = {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: { user: UserResponse; token: string; rememberMe?: boolean }) => void;
  updateUser: (user: UserResponse) => void;
  logout: () => void;
  hydrate: () => void;
};

const TOKEN_KEY = "steriox_token";
const USER_KEY = "steriox_user";
const STORAGE_TYPE_KEY = "steriox_auth_storage_type";

const isBrowser = typeof window !== "undefined";

const getActiveStorage = (): Storage | null => {
  if (!isBrowser) return null;
  const type = window.localStorage.getItem(STORAGE_TYPE_KEY) || window.sessionStorage.getItem(STORAGE_TYPE_KEY);
  return type === "local" ? window.localStorage : window.sessionStorage;
};

const clearAuthStorage = () => {
  if (!isBrowser) return;
  [window.localStorage, window.sessionStorage].forEach((storage) => {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(STORAGE_TYPE_KEY);
  });
};

const readStoredAuth = () => {
  const storage = getActiveStorage();
  if (!storage) return { token: null, user: null };

  const token = storage.getItem(TOKEN_KEY);
  const rawUser = storage.getItem(USER_KEY);

  if (!token || !rawUser) return { token: null, user: null };

  try {
    return { token, user: JSON.parse(rawUser) as UserResponse };
  } catch {
    clearAuthStorage();
    return { token: null, user: null };
  }
};

const storedAuth = readStoredAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: storedAuth.user,
  token: storedAuth.token,
  isAuthenticated: Boolean(storedAuth.token && storedAuth.user),

  login: ({ user, token, rememberMe = false }) => {
    if (isBrowser) {
      clearAuthStorage();

      const storage = rememberMe ? window.localStorage : window.sessionStorage;
      const storageType = rememberMe ? "local" : "session";

      storage.setItem(TOKEN_KEY, token);
      storage.setItem(USER_KEY, JSON.stringify(user));
      storage.setItem(STORAGE_TYPE_KEY, storageType);
    }

    set({ user, token, isAuthenticated: true });
  },

  updateUser: (user) => {
    const storage = getActiveStorage();

    if (storage) {
      storage.setItem(USER_KEY, JSON.stringify(user));
    }

    set({ user });
  },

  logout: () => {
    clearAuthStorage();
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    const auth = readStoredAuth();
    set({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token && auth.user),
    });
  },
}));
