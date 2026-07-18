export const PATHS = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  HOME: "/",
  STREAMS: {
    DETAIL: (id: string) => `/streams/${id}`,
    SETUP: "/streams/setup",
    DASHBOARD: "/streams/dashboard",
  },
  SETTING: "/setting",
  ERROR: {
    NOT_FOUND: "*",
    FORBIDDEN: "/403",
  },
} as const;