import { timingSafeEqual } from 'node:crypto';
import { list } from '@vercel/blob';

// The two files the site serves. Each upload lands in its own folder.
export const SLOTS = {
  work: { label: 'Portfolio (WORK)', prefix: 'work/' },
  info: { label: 'Info', prefix: 'info/' },
};

// Shown until the first upload of each slot (the files from the old Sanity setup).
export const FALLBACK = {
  work: 'https://cdn.sanity.io/files/zm1c5kla/production/1ff8be9152af67ed843f8d893de380c585ad4abf.pdf',
  info: 'https://cdn.sanity.io/files/zm1c5kla/production/839e1e3eb4fee1faf4e3c84eb7a661b3ef0ca675.pdf',
};

// All blobs of a slot, newest first.
export async function blobsFor(slot) {
  const { blobs } = await list({ prefix: SLOTS[slot].prefix });
  return blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

// HTTP Basic Auth against ADMIN_USER / ADMIN_PASSWORD env vars.
export function isAuthorized(request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const user = process.env.ADMIN_USER || 'corinne';
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return false;
  const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
  const i = decoded.indexOf(':');
  if (i < 0) return false;
  return safeEqual(decoded.slice(0, i), user) && safeEqual(decoded.slice(i + 1), password);
}

export function unauthorized() {
  return new Response('Login erforderlich', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Corinne Futterlieb Admin", charset="UTF-8"' },
  });
}
