# Refactoring Guide — SterioX Frontend

## Overview

**Stack:** React 19 + TypeScript 6 + Vite 8 + Tailwind CSS v4 + Zustand 5 + React Router 7
**State:** Zustand (auth only); everything else is local `useState`
**Data fetching:** Raw `useEffect` + `useState` (no React Query / SWR)
**WebSocket:** STOMP via `@stomp/stompjs` inside a React Context
**Testing:** None (not set up)

---

## Architecture Principles

### 1. Component Structure

```
src/
  api/           # API layer (no change)
  components/
    stream/      # Domain-specific components
    ui/          # Reusable primitives (Button, Input, Logo)
  hooks/         # <-- ADD: custom hooks (useLivestreamSocket, useAuth, etc.)
  context/       # Keep SocketContext
  layouts/       # Layout components (MainLayout)
  lib/           # <-- ADD: utility helpers, formatters, constants
  pages/         # Page components KEEP SLIM
  routes/        # Route config + loaders
  stores/        # Zustand stores
  types/         # TypeScript types
```

**Rule:** Pages should NOT contain data-fetching, socket logic, or complex business logic. Extract all of these into custom hooks.

### 2. Naming Conventions

| Concept | Convention | Example |
|---------|-----------|---------|
| Files | `camelCase` | `authStore.ts`, `useStreamSocket.ts` |
| Components | `PascalCase` | `CustomStreamPlayer.tsx`, `MainLayout.tsx` |
| Hooks | `useXxx` | `useSocket.ts`, `useAuth.ts` |
| Types | `PascalCase` | `StreamResponse`, `LoginRequest` |
| API modules | `snakeCase` | `streamApi`, `userApi` |
| CSS classes | Tailwind utility only | No CSS modules, no styled-components |
| Directories | single word | `ui/`, `stream/`, `hooks/` |

### 3. File Size Limit

**Max 250 lines per file.** If a file exceeds this, extract logic into hooks, sub-components, or utility modules.

Current violations:
- `LivestreamSetupPage.tsx` — 595 lines → extract: form sections, stream key section, categories section
- `LivestreamDashboardPage.tsx` — 494 lines → extract: socket hook, metrics cards, chat panel, donations
- `LivestreamPage.tsx` — 380 lines → extract: socket hook, stats cards, chat panel, donations
- `SettingPage.tsx` — 349 lines → extract: each tab as separate component
- `HomePage.tsx` — 234 lines → OK but could extract stream card and category card as components
- `CustomStreamPlayer.tsx` — 240 lines → OK

---

## Code Quality Rules

### R1. No `useEffect` for Data Fetching Without Abort

Every async `useEffect` that performs API calls MUST implement an abort controller:

```ts
useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const data = await api.get('/path', { signal: abortController.signal });
      // ... set state
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return; // ignore
      // handle error
    }
  };

  fetchData();

  return () => abortController.abort();
}, [deps]);
```

### R2. Extract Duplicate Socket Logic Into a Custom Hook

`LivestreamPage.tsx` and `LivestreamDashboardPage.tsx` have **identical** socket subscription code. Extract:

```ts
// hooks/useLivestreamSocket.ts
export function useLivestreamSocket(streamId: string) {
  const { isConnected, sendMessage, subscribeTopic } = useSocket();
  const [currentViews, setCurrentViews] = useState(0);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [chats, setChats] = useState<StreamChatResponse[]>([]);

  useEffect(() => {
    if (!streamId || !isConnected) return;

    const unsubStatus = subscribeTopic(`/topic/status-livestream/${streamId}`, ...);
    const unsubLikes = subscribeTopic(`/topic/likes-livestreams/${streamId}`, ...);
    const unsubChat = subscribeTopic(`/topic/chat/${streamId}`, ...);
    const heartbeat = setInterval(() => sendHeartbeat(streamId), 10000);

    return () => {
      unsubStatus(); unsubLikes(); unsubChat();
      clearInterval(heartbeat);
    };
  }, [streamId, isConnected]);

  return { currentViews, currentLikes, chats };
}
```

### R3. Use Route Path Constants

`src/routes/paths.ts` exists but is incomplete and unused. **Every navigational string MUST come from `PATHS`:**

```ts
export const PATHS = {
  AUTH: { LOGIN: "/login", REGISTER: "/register" },
  HOME: "/",
  LIVESTREAMS: {
    DETAIL: (id: string) => `/livestreams/${id}`,
    SETUP: "/livestreams/setup",
    DASHBOARD: "/livestreams/dashboard",
  },
  SETTING: "/setting",
} as const;
```

**Reason:** Currently pages hardcode strings like `"/login"`, `"/livestreams/setup"` — if a path changes, you need to grep everywhere.

### R4. Purge Mock Data

Remove ALL hardcoded mock data from production code:
- `LivestreamPage.tsx:38` — hardcoded `tags` array
- `LivestreamPage.tsx:157` — `mockDonations` array
- `LivestreamDashboardPage.tsx:221` — `mockMetrics` object
- `LivestreamDashboardPage.tsx:242` — `mockDonations` array
- `MainLayout.tsx:41` — `channels` array
- `HomePage.tsx:55` — `categories` array (should come from API)

**Rule:** If the endpoint doesn't exist yet, mark the area with a `TODO` comment and render a placeholder, not fake data.

### R5. Remove Dead Code

- `'use client'` directive in `CustomStreamPlayer.tsx:1` — this is a Next.js convention, remove it
- Commented-out code blocks (e.g., `LivestreamDashboardPage.tsx:151-196` — polling useEffect)
- Unused dependencies: `video.js`, `@videojs/react` — remove from `package.json`
- Commented-out JSX (e.g., `SettingPage.tsx:162`, `LivestreamPage.tsx:297`)
- Empty directories `src/assets/`, `src/lib/`

### R6. Consistent Language

The app is Vietnamese. All console logs, user-facing text, and comments should be:
- **User-facing text:** Vietnamese (keep as-is)
- **Console logs:** Vietnamese OR English, but pick ONE and be consistent
- **Comments:** Vietnamese or English, but pick ONE

Fix mixed-language console logs:
```
🔌 Đang khởi tạo kết nối Socket...  →  🔌 Đang kết nối Socket...
Socket Connected!                    →  Đã kết nối Socket!
Unlistened to this channel.          →  Đã hủy đăng ký kênh: {topic}
```

### R7. Fix Known Bugs

| File | Issue | Fix |
|------|-------|-----|
| `userApi.ts:31` | URL typo: `/user/${id}` → `/users/${id}` | Change to `/users/${id}` |
| `authApi.ts:26` | Function name typo: `introspec` → `introspect` | Rename and fix callers |
| `streamApi.ts:26` | Function name typo: `getStreamOnlineOfUSer` → `getStreamOnlineOfUser` | Rename and fix callers |
| `CreateCategoryRequest.slu` | Typo: `slu` → `slug` | Fix type |
| `HeartBeatMessge` | Typo: `Messge` → `Message` | Fix type |
| `paths.ts:3` | Missing leading `/` on `REGISTER: "register"` | Fix to `"/register"` |
| `Button.tsx` | Variant styles use literal colors (`bg-pink-500` in comment vs actual code uses `bg-primary`) | Ensure all use theme tokens |
| `Input.tsx` | Uses undefined theme tokens: `bg-surface`, `text-surface-foreground`, `text-muted-foreground`, `bg-muted` | Replace with existing tokens from `index.css` |
| `Button.tsx` | Typo in comment: "Đã đổi 'secondary' thành 'outline'" | Remove comment or fix typo |

### R8. Add Error Boundaries

Wrap the app or at least main routes in React Error Boundaries:

```tsx
class StreamErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <FallbackUI />;
    return this.props.children;
  }
}
```

### R9. Add Loading States

Every page that fetches data MUST show a loading indicator. Currently:
- `HomePage` — shows nothing while fetching, then renders empty grid
- `LivestreamDashboardPage` — renders "Ngoại tuyến" / 0 views before data arrives
- `LivestreamSetupPage` — categories appear only after fetch

Use a shared `<Skeleton />` component or loading spinner.

### R10. Axios Response Interceptor — Handle 401

The response interceptor only unwraps errors. Add automatic logout on 401:

```ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data ?? error);
  },
);
```

### R11. Form Validation Consistency

Login and Register pages have inline validation functions. **Extract into a reusable validation utility:**

```ts
// lib/validation.ts
export const validators = {
  email: (v: string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) ? null : "Email không hợp lệ.",
  required: (v: string, label: string) => v.trim() ? null : `${label} không được để trống.`,
  minLength: (v: string, min: number, label: string) => v.length >= min ? null : `${label} phải có ít nhất ${min} ký tự.`,
};
```

### R12. Remove Redundant Auth Checks

`HomePage`, `LivestreamPage`, `LivestreamDashboardPage`, `LivestreamSetupPage` all check `isAuthenticated` in useEffect and redirect to `/login`. This causes a flash.

**Better:** Use route-level guard:

```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
```

Or use React Router's `loader` to redirect before rendering.

### R13. Enable TypeScript Strict Mode

`tsconfig.app.json` does NOT have `"strict": true`. Enable it:

```json
{
  "compilerOptions": {
    "strict": true,
    // ... existing options
  }
}
```

This will catch null-checks, `any` issues, and implicit `undefined` returns.

### R14. Remove Redundant Second `useAuthStore()` Call

In `MainLayout.tsx:30`, `useAuthStore()` is called again just to destructure `isAuthenticated`, even though `user` and `token` are already destructured on line 26. Consolidate:

```ts
const { user, token, isAuthenticated, logout, setToken } = useAuthStore();
```

### R15. Replace any Types

Files currently use `any` in several places:
- `SocketContext.tsx:8` — `subscribeTopic` callback parameter: `(message: any)`
- `SocketContext.tsx:8` — `sendMessage` payload: `payload: any`
- `streamApi.ts:47,51` — `ApiResponse<any>`

Replace with proper types. If the response type varies, use generics.

### R16. Auth Store — Use Zustand Persist Middleware

Instead of manually managing localStorage/sessionStorage, use Zustand's `persist` middleware:

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: (payload) => set({ ...payload, isAuthenticated: true }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
  }),
  {
    name: 'steriox-auth',
    storage: createJSONStorage(() => localStorage),
    // Handle rememberMe: use a partialize to switch storage
  },
));
```

### R17. Add a Shared Page Section / Card Component

Every page repeats the same card pattern: `bg-background border border-accent rounded-2xl p-5`. Extract a `<Card>` component:

```tsx
interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

function Card({ children, className, padding = 'md' }: CardProps) {
  const paddingClasses = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`bg-background border border-accent rounded-2xl ${paddingClasses[padding]} ${className ?? ''}`}>
      {children}
    </div>
  );
}
```

### R18. Duplicate Stream Key / URL Copy UI

The "Stream URL copy" + "Stream Key copy with show/hide" pattern appears identically in:
- `LivestreamDashboardPage.tsx:350-388`
- `LivestreamSetupPage.tsx:479-513`

Extract to a reusable `<StreamCredentialField>` or `<CopyField>` component.

### R19. Duplicate Chat Panel UI

The entire chat panel (header + message list + input form) appears identically in:
- `LivestreamPage.tsx:306-350`
- `LivestreamDashboardPage.tsx:420-464`

Extract to a `<ChatPanel>` component.

### R20. Duplicate Donations Panel UI

The "Vinh danh quyên góp" section appears identically in both Livestream pages. Extract to a `<DonationsPanel>` component.

### R21. HomePage Auth Redirect Causes Flash

Instead of checking auth in useEffect and navigating, use a route guard. If the user is not authenticated and tries to access `/`, redirect before render:

```tsx
// routes/index.tsx
{
  path: "/",
  loader: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) throw redirect("/login");
    return null;
  },
  element: <MainLayout />,
  children: [...]
}
```

### R22. Fix AuthPage Redirects

LoginPage and RegisterPage use `<Navigate to="/" replace />` which is fine, but if the home page also redirects to `/login` when not authenticated, this creates a redirect loop edge case. Use route guards consistently.

### R23. Add React Query (Highly Recommended)

The current `useEffect` + `useState` pattern for every data fetch is error-prone and lacks:
- Request deduplication
- Cache
- Revalidation
- Loading/error states

Add `@tanstack/react-query` and convert all API calls:

```tsx
// Before
const [streams, setStreams] = useState([]);
useEffect(() => {
  streamApi.getTopStream().then(setStreams);
}, []);

// After
const { data: streams, isLoading, error } = useQuery({
  queryKey: ['top-streams'],
  queryFn: streamApi.getTopStream,
});
```

### R24. Setup Testing

No test framework exists. Add Vitest:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Then add a `__tests__/` directory mirroring `src/` and write tests for:
- UI components (Button, Input, Logo)
- Auth store
- Validation utilities
- Hooks

---

## File-by-File Priority Task List

| Priority | File | Action |
|----------|------|--------|
| P0 | `userApi.ts` | Fix `/user/` → `/users/` typo |
| P0 | `authApi.ts` | Fix `introspec` → `introspect` |
| P0 | `paths.ts` | Fix missing `/` on REGISTER, add all paths |
| P1 | `LivestreamPage.tsx` + `LivestreamDashboardPage.tsx` | Extract shared socket logic → `useLivestreamSocket` hook |
| P1 | `CustomStreamPlayer.tsx` | Remove `'use client'` |
| P1 | `Input.tsx` | Fix undefined theme tokens |
| P1 | `Button.tsx` | Ensure theme token usage |
| P1 | `index.css` | Add missing tokens (`--surface`, `--muted`, etc.) |
| P1 | `package.json` | Remove `video.js`, `@videojs/react`, `@types/video.js` |
| P2 | All API files | Add abort controllers to all fetches |
| P2 | All pages | Add loading states |
| P2 | `MainLayout.tsx` | Consolidate `useAuthStore()` call |
| P2 | `MainLayout.tsx` + `routes/index.tsx` | Implement route-level auth guard |
| P2 | All pages | Remove hardcoded mock data |
| P2 | `LivestreamPage.tsx` + `LivestreamDashboardPage.tsx` | Extract ChatPanel + DonationsPanel + StreamKeyField components |
| P2 | `LivestreamSetupPage.tsx` | Split into smaller sub-components |
| P2 | `SettingPage.tsx` | Extract each tab as separate component |
| P2 | `apiClient.ts` | Add 401 auto-logout to response interceptor |
| P3 | All files | Replace hardcoded path strings with `PATHS` constants |
| P3 | All files | Clean up commented-out code |
| P3 | All files | Fix mixed-language console logs |
| P3 | `authStore.ts` | Migrate to Zustand persist middleware |
| P3 | All files | Replace `any` types with proper generics |
| P4 | `tsconfig.app.json` | Enable `strict: true` |
| P4 | Setup `@tanstack/react-query` | Migrate all data fetching |
| P4 | Setup Vitest + RTL | Add test coverage |
| P4 | Add Error Boundaries | Wrap route trees |

---

## Git Workflow Rules During Refactoring

1. **One concern per commit.** Do NOT fix "typo in userApi" AND "extract socket hook" in the same commit.
2. **Prefix commit messages** with the category: `refactor:`, `fix:`, `chore:`, `style:`, `test:`.
3. **Do NOT change behavior** while refactoring. Extract, rename, reorganize — but keep the app functionally identical.
4. **Run `npm run build`** after every significant change to catch TypeScript errors.
5. **Run `npm run lint`** after every commit.
6. **Do NOT** refactor and add features in the same branch. Use separate branches.

---

## Final Non-Negotiables

| # | Rule | Why |
|---|------|-----|
| 1 | No file > 250 lines | Readability, maintainability |
| 2 | No `any` type | Type safety |
| 3 | No mock data in production | Realism, prevents bugs |
| 4 | No `useEffect` without cleanup | Memory leaks, stale state |
| 5 | No duplicated logic > 10 lines | DRY |
| 6 | All paths from `PATHS` constant | Maintainability |
| 7 | All components use theme tokens | Design consistency |
| 8 | All pages have loading + error state | UX quality |
| 9 | No commented-out code | Dead code is noise |
| 10 | Every commit passes `tsc -b && vite build` | Prevent regression |
