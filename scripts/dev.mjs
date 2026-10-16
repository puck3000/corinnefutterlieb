// Local stand-in for Vercel: serves public/ and routes vercel.json rewrites to api/*.js.
// Usage: npm run dev:local   (reads .env.local if present)
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 3000;
const cfg = JSON.parse(await fs.readFile(path.join(root, 'vercel.json'), 'utf8'));
const types = { '.html': 'text/html; charset=utf-8', '.otf': 'font/otf', '.ico': 'image/x-icon' };

if (!process.env.ADMIN_PASSWORD) {
  process.env.ADMIN_PASSWORD = 'test';
  console.log('ADMIN_PASSWORD not set, using "test"');
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.log('BLOB_READ_WRITE_TOKEN not set: site and login work, uploads will fail (see README)');
}

http.createServer(async (req, res) => {
  try {
    let url = new URL(req.url, `http://localhost:${port}`);
    const rw = cfg.rewrites.find((r) => r.source === url.pathname);
    if (rw) url = new URL(rw.destination, url);

    if (url.pathname.startsWith('/api/')) {
      const mod = await import(pathToFileURL(path.join(root, url.pathname + '.js')));
      const handler = mod[req.method];
      if (!handler) return res.writeHead(405).end('Method not allowed');
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: chunks.length ? Buffer.concat(chunks) : undefined,
      });
      const r = await handler(request);
      res.writeHead(r.status, Object.fromEntries(r.headers));
      return res.end(Buffer.from(await r.arrayBuffer()));
    }

    const rel = url.pathname === '/' ? 'index.html' : path.normalize(url.pathname).replace(/^[/\\]+/, '');
    const file = path.join(root, 'public', rel);
    if (!file.startsWith(path.join(root, 'public'))) return res.writeHead(403).end();
    const data = await fs.readFile(file);
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' }).end(data);
  } catch (err) {
    if (err.code === 'ENOENT') return res.writeHead(404).end('404');
    console.error(err);
    res.writeHead(500).end(String(err));
  }
}).listen(port, () => {
  console.log(`\n  Site:  http://localhost:${port}/\n  Admin: http://localhost:${port}/admin  (user: ${process.env.ADMIN_USER || 'corinne'})\n`);
});
