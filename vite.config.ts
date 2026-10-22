import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

function apiShareDevPlugin(): Plugin {
  return {
    name: 'api-share-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/share', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        const code = url.searchParams.get('code');

        if (req.method === 'GET') {
          if (!code) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Code is required' }));
            return;
          }

          try {
            const remote = await fetch(`https://api.cl1p.net/dejung_${code.toUpperCase()}`);
            if (!remote.ok) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Plan not found' }));
              return;
            }
            const text = await remote.text();
            const data = JSON.parse(text);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, data }));
          } catch {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to retrieve plan' }));
          }
          return;
        }

        if (req.method === 'POST') {
          const buffers: Uint8Array[] = [];
          for await (const chunk of req) {
            buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          let bodyData: Record<string, unknown>;
          try {
            bodyData = JSON.parse(raw);
          } catch {
            bodyData = {};
          }

          const planCode = bodyData?.code;
          const state = bodyData?.state;

          if (!planCode || !state) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Code and state are required' }));
            return;
          }

          try {
            await fetch(`https://api.cl1p.net/dejung_${String(planCode).toUpperCase()}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(state),
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, code: planCode }));
          } catch {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to save plan' }));
          }
          return;
        }

        res.statusCode = 405;
        res.end();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    apiShareDevPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'Dejung — วางแผนงบประมาณ',
        short_name: 'Dejung',
        description: 'เครื่องมือวางแผนงบประมาณแบบแบ่งเปอร์เซ็นต์และรายวัน',
        theme_color: '#0A0D14',
        background_color: '#0A0D14',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
})
