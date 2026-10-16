import { SLOTS, blobsFor, isAuthorized, unauthorized } from './_lib.js';

const BLOB_CLIENT = 'https://cdn.jsdelivr.net/npm/@vercel/blob@2.8.0/dist/client.js/+esm';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const fmtDate = (d) =>
  new Date(d).toLocaleString('de-CH', { timeZone: 'Europe/Zurich', dateStyle: 'medium', timeStyle: 'short' });

const fmtSize = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;

// GET /admin shows the current files and two upload forms.
export async function GET(request) {
  if (!isAuthorized(request)) return unauthorized();

  const sections = await Promise.all(
    Object.entries(SLOTS).map(async ([slot, { label }]) => {
      let current = '<p class="muted">Noch nichts hochgeladen (es wird die alte Datei angezeigt).</p>';
      try {
        const [newest] = await blobsFor(slot);
        if (newest) {
          current = `<p>Aktuell: <a href="${esc(newest.url)}" target="_blank">${esc(newest.pathname.split('/').pop())}</a><br>
            <span class="muted">${fmtSize(newest.size)} · hochgeladen ${esc(fmtDate(newest.uploadedAt))}</span></p>`;
        }
      } catch (err) {
        current = `<p class="error">Speicher nicht erreichbar: ${esc(err.message)}</p>`;
      }
      return `<section>
        <h2>${esc(label)}</h2>
        ${current}
        <form data-slot="${slot}">
          <input type="file" name="file" accept="application/pdf,.pdf" required>
          <button type="submit">Hochladen</button>
          <progress max="100" value="0" hidden></progress>
          <p class="status" role="status"></p>
        </form>
      </section>`;
    }),
  );

  const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Admin · Corinne Futterlieb</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.5 system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; }
  h1 { font-size: 1.5rem; } h2 { font-size: 1.15rem; margin-bottom: .25rem; }
  section { border: 1px solid #8884; border-radius: 8px; padding: 1rem 1.25rem; margin: 1.5rem 0; }
  form { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
  progress { width: 100%; }
  .status { width: 100%; margin: 0; min-height: 1.5em; }
  .muted { color: #888; } .error { color: #c00; } .ok { color: #080; }
  button { padding: .4rem 1rem; cursor: pointer; }
</style>
</head>
<body>
<h1>Corinne Futterlieb · Dateien</h1>
<p>Neues PDF wählen und hochladen. Es ersetzt die bisherige Datei auf <a href="/" target="_blank">der Website</a> sofort.</p>
${sections.join('\n')}
<script type="module">
import { upload } from '${BLOB_CLIENT}';

for (const form of document.querySelectorAll('form[data-slot]')) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const slot = form.dataset.slot;
    const file = form.file.files[0];
    const status = form.querySelector('.status');
    const bar = form.querySelector('progress');
    const button = form.querySelector('button');
    if (!file) return;
    if (!/\\.pdf$/i.test(file.name)) { status.className = 'status error'; status.textContent = 'Bitte eine PDF-Datei wählen.'; return; }

    button.disabled = true; bar.hidden = false; bar.value = 0;
    status.className = 'status'; status.textContent = 'Wird hochgeladen …';
    try {
      const safeName = file.name.normalize('NFKD').replace(/[^\\w.-]+/g, '-');
      await upload(slot + '/' + safeName, file, {
        access: 'public',
        contentType: 'application/pdf',
        handleUploadUrl: '/admin/upload',
        multipart: file.size > 10 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => { bar.value = percentage; },
      });
      await fetch('/admin/upload', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'prune', slot }),
      });
      status.className = 'status ok'; status.textContent = 'Fertig! Die Website zeigt jetzt die neue Datei.';
      setTimeout(() => location.reload(), 1500);
    } catch (err) {
      status.className = 'status error'; status.textContent = 'Fehler: ' + err.message;
    } finally {
      button.disabled = false;
    }
  });
}
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
