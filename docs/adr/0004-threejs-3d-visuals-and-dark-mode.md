# 0004: Three.js 3D Visual Experience, Dark Mode, and Mitr Typography

We decided to upgrade the UI/UX with Three.js ambient 3D background particles and an interactive reactive 3D Coin, full Dark Mode support using Midnight Blue (`#10182D`) from the brand logo, and Google Font 'Mitr'.

### Context & Trade-off
To elevate Dejung from a traditional utility planner into an engaging, modern Gen Z financial application, subtle 3D elements add visual depth and immediate feedback on financial health (coin color shifting between emerald/lime when balanced and soft rose when over budget).

To maintain high performance and 60 FPS on mobile devices (iOS/iPadOS):
1. The 3D background is implemented using a lightweight, performant Three.js particle wave / floating starfield with low polycount and zero heavy post-processing shaders.
2. The interactive 3D coin uses simple geometry (CylinderGeometry) with phong/standard lighting that cleans up its animation loop when invisible or blurred.
3. Dark Mode leverages Tailwind CSS class-based theming with translucent glassmorphic cards (`backdrop-blur-md`), preserving legibility over the 3D background.
