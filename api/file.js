import { SLOTS, FALLBACK, blobsFor } from './_lib.js';

// GET /work and /info (see vercel.json) redirect to the newest uploaded PDF.
export async function GET(request) {
  const slot = new URL(request.url).searchParams.get('slot');
  if (!SLOTS[slot]) return new Response('Not found', { status: 404 });

  let target = FALLBACK[slot];
  try {
    const [newest] = await blobsFor(slot);
    if (newest) target = newest.url;
  } catch (err) {
    console.error('blob list failed, using fallback', err);
  }
  return new Response(null, {
    status: 302,
    headers: { Location: target, 'Cache-Control': 'no-store' },
  });
}
