---
name: refactor-react-page
description: Refactor bloated React pages into clean, modular, and maintainable components following clean code practices.
license: MIT
compatibility: opencode
metadata:
  framework: react
  workflow: refactoring
---

## Objective

Refactor a given React page or complex component into clean, readable, modular, and maintainable code adhering to standard React best practices and separation of concerns.

---

## Refactoring Guidelines & Rules

### 1. Leverage JSX Shorthands

- **Boolean props:** Omit `={true}` when passing boolean props (`<Navbar showTitle />` instead of `<Navbar showTitle={true} />`).
- **String props:** Use plain double quotes without curly braces for literal string props (`<Header title="Dashboard" />` instead of `<Header title={"Dashboard"} />`).

### 2. Single Responsibility & Component Decomposition

- Break down bloated page components into smaller, focused child components.
- Keep the main page component high-level so it reads like a clean layout or table of contents.
- **Don't over-fragment.** Extract a piece into its own component or hook when at least one of these is true: it's reused elsewhere, it has its own state/side effects, or it meaningfully shortens/clarifies the parent (rough guide: the parent exceeds ~150-200 lines, or the block is doing something conceptually distinct). A five-line block used once, with no independent logic, can usually stay inline. The goal is readability, not a file-count trophy.

### 3. File Separation

- Ensure every component resides in its own dedicated file (e.g., `src/components/MyComponent.jsx` or `.tsx`).
- Keep component imports organized and avoid inline component declarations within the same file unless they are tiny and private.

### 4. Extract State & Side Effects into Custom Hooks

- Move data fetching, subscriptions, complex state logic, and repeated side effects out of the component and into custom React hooks.
- **Organize hooks into domain subfolders**, not flat inside `src/hooks/`. Group by the feature/domain the hook belongs to, e.g. `src/hooks/auth/useSession.js`, `src/hooks/streams/usePosts.js`, `src/hooks/checkout/useCart.js`. Pick the domain name from what the page/component is about (auth, posts, streams, checkout, notifications, etc.) — don't dump every hook straight into `src/hooks/`.
- If a hook is truly generic and reusable across unrelated domains (e.g. `useDebounce`, `useLocalStorage`), it can live in `src/hooks/common/`.

### 5. Clean JSX & Extract Event Handlers

- Remove inline arrow functions and complex business logic from JSX event listeners (e.g., `onClick={(e) => ...}`).
- Move logic into named handler functions above the `return` statement (e.g., `handleButtonClick`).

### 6. Externalize Styles & Constants

- Avoid large inline `style={{ ... }}` objects directly in JSX elements. Move styles to CSS/Tailwind classes, CSS Modules, or separate `styles` objects/constants.
- Move literal magic strings or default configurations to named constants or configuration files outside component functions.

### 7. Avoid Prop Drilling with Context or Composition

- For genuinely cross-cutting, page-or-app-wide state (e.g., auth/user session, theme, feature flags), use React Context.
- Prefer composition (passing `children` or slotting components) over Context for anything narrower — Context adds indirection and re-render considerations, so don't reach for it just because a prop is passed down two or three levels.

### 8. Preserve Type Safety (TypeScript projects)

- When extracting components and hooks, define or carry over explicit prop/return types (`interface Props { ... }`, hook return types) rather than letting them default to `any` or get inferred loosely.
- Keep exported types colocated with the component/hook they describe, or in a shared `types.ts` if used across files.

---

## Execution Workflow

1. **Analyze the Target File:** Read the page file to identify component responsibilities, state variables, side effects, inline styles, and JSX complexity.
2. **Plan the Structure:** Outline the list of child components, custom hooks, and utility files to create — applying the "don't over-fragment" guidance from Rule 2.
3. **Extract Custom Hooks:** Pull data fetching and state management out into standalone hooks, placed under a domain subfolder in `src/hooks/` (e.g. `src/hooks/posts/`, `src/hooks/auth/`) — see Rule 4.
4. **Create Child Components:** Extract JSX blocks into modular components in `src/components/`.
5. **Clean up Handler Functions & Styles:** Name event handlers and strip inline styles/magic strings from JSX.
6. **Reassemble the Main Page:** Import and render the refactored components cleanly inside the page component.
7. **Verify & Review:** Confirm behavior is preserved before considering the refactor done:
   - Run the project's linter/typechecker (`eslint`, `tsc --noEmit`) and fix any new errors introduced by the extraction.
   - Run the build (`npm run build` or equivalent) to catch broken imports/exports.
   - Run existing tests (`npm test`) if present; add a quick smoke test if the page had none.
   - Manually diff the rendered props/output for each extracted component against the original inline JSX to confirm nothing changed (same props passed, same conditional rendering logic, same keys).

---

## Before & After Example

### ❌ Before (Bloated Single File)

```jsx
// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <main style={{ padding: '20px' }}>
      <Navbar showTitle={true} title={'Dashboard'} />
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            onClick={(e) => {
              console.log('Clicked', post.id);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### ✅ After (Refactored)

```js
// src/hooks/posts/usePosts.js
import { useState, useEffect } from 'react';
import { POSTS_ENDPOINT } from '../../constants/api';

export function usePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(POSTS_ENDPOINT)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return posts;
}
```

```js
// src/constants/api.js
export const POSTS_ENDPOINT = 'https://api.example.com/posts';
```

```css
/* src/pages/Dashboard.module.css */
.main {
  padding: 20px;
}
```

```jsx
// src/components/PostList.jsx
export default function PostList({ posts, onPostClick }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id} onClick={() => onPostClick(post.id)}>
          {post.title}
        </li>
      ))}
    </ul>
  );
}
```

```jsx
// src/pages/Dashboard.jsx
import Navbar from '../components/Navbar';
import PostList from '../components/PostList';
import { usePosts } from '../hooks/posts/usePosts';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const posts = usePosts();

  function handlePostClick(postId) {
    console.log('Clicked', postId);
  }

  return (
    <main className={styles.main}>
      <Navbar showTitle title="Dashboard" />
      <PostList posts={posts} onPostClick={handlePostClick} />
    </main>
  );
}
```

This reads top-to-bottom like a table of contents: data comes from `usePosts`, which lives under `hooks/posts/` rather than flat in `hooks/` (Rule 4), layout styling is externalized, the click handler is named and passed down instead of inlined, and `PostList` is its own file since it has its own rendering concern (worth extracting per Rule 2) — while `Navbar` was left as an existing external component rather than being re-decomposed unnecessarily.
