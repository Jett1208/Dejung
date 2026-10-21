# 0001: Client-Side Local-First Architecture with LocalStorage

We decided to build the application as a client-side Single Page Application (SPA) using React, TypeScript, and Vite, storing all user configuration and budget data in the browser's `LocalStorage` without requiring a backend server or authentication.

This decision was chosen because the application is a personal planning tool where user privacy, zero setup friction, instant responsiveness, and zero hosting costs are prioritized. Users can use the planner immediately without creating accounts, and their sensitive financial data never leaves their local device. If multi-device sync is needed in the future, file export/import (JSON) will be provided as an intermediary step before considering cloud synchronization.
