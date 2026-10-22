import type { IncomingMessage, ServerResponse } from 'http';

interface CustomRequest extends IncomingMessage {
  query?: Record<string, string>;
  body?: Record<string, unknown>;
}

export default async function handler(req: CustomRequest, res: ServerResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Parse URL query
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const code = url.searchParams.get('code') || req.query?.code;

  if (req.method === 'GET') {
    if (!code || typeof code !== 'string') {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Code is required' }));
      return;
    }

    try {
      const response = await fetch(`https://api.cl1p.net/dejung_${code.toUpperCase()}`);
      if (!response.ok) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Plan not found' }));
        return;
      }

      const text = await response.text();
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
    let bodyData = req.body;
    if (!bodyData) {
      try {
        const buffers: Uint8Array[] = [];
        for await (const chunk of req) {
          buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const raw = Buffer.concat(buffers).toString();
        bodyData = JSON.parse(raw);
      } catch {
        bodyData = {};
      }
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
}
