import { handleUpload } from '@vercel/blob/client';
import { del } from '@vercel/blob';
import { SLOTS, blobsFor, isAuthorized, unauthorized } from './_lib.js';

const MAX_BYTES = 500 * 1024 * 1024; // 500 MB

// POST /admin/upload
//  - { type: 'blob.generate-client-token', ... }  issued by upload() in the browser
//  - { action: 'prune', slot }                    deletes all but the newest file of a slot
// Both require the admin login.
export async function POST(request) {
  if (!isAuthorized(request)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body?.action === 'prune') {
    if (!SLOTS[body.slot]) return Response.json({ error: 'Unknown slot' }, { status: 400 });
    const [, ...older] = await blobsFor(body.slot);
    if (older.length) await del(older.map((b) => b.url));
    return Response.json({ deleted: older.length });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const ok = Object.values(SLOTS).some((s) => pathname.startsWith(s.prefix));
        if (!ok || !pathname.toLowerCase().endsWith('.pdf')) {
          throw new Error('Nur PDF-Dateien für Portfolio oder Info erlaubt');
        }
        return {
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
