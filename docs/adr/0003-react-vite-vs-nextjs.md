# 0003: Choosing React (Vite) over Next.js for Local-First Planner

We decided to use React with Vite rather than Next.js for this application.

### Context & Trade-off
Next.js provides Server-Side Rendering (SSR) and API routes, which are valuable for SEO-driven public websites and server-backed applications. However, this application is a private, client-side budget planner that relies on browser `LocalStorage` and PWA offline capabilities.

Using Next.js would introduce:
1. Hydration mismatch challenges when reading user data from `LocalStorage` during SSR.
2. Unnecessary build complexity and runtime overhead for features (SSR, Server Actions) that are unused.
3. Added friction for simple static PWA service worker setups.

Vite + React SPA delivers instant development feedback, zero server dependency, straightforward PWA integration, effortless free hosting on static hosts (Vercel, Cloudflare Pages, GitHub Pages), and zero SSR hydration quirks.
