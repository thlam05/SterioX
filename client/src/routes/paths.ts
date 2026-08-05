export const PATHS = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/forgot-password",
  },
  PROTECTED: {
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
  },
  ERROR: {
    NOT_FOUND: "*",
    FORBIDDEN: "/403",
    SERVER_ERROR: "/500",
  },
} as const;