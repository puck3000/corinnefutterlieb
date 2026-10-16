# corinne-futterlieb.com

One static page plus a password-protected upload page. No database, no CMS.

```
public/index.html   the website (HTML + inline CSS, 1:1 copy of the previous Next.js site)
public/fonts/       GT America font
api/file.js         /work and /info  -> redirect to the newest uploaded PDF
api/admin.js        /admin           -> upload page (HTTP Basic Auth)
api/upload.js       /admin/upload    -> issues upload tokens, deletes older versions
vercel.json         routes
```

PDFs live in a public **Vercel Blob** store. The browser uploads straight to Blob,
so large portfolios (30 MB+) are no problem. Until the first upload, `/work` and
`/info` fall back to the old Sanity CDN files (see `FALLBACK` in `api/_lib.js`).

## One-time setup on Vercel

1. Point the Vercel project for the domain at this repo. In *Settings > Build & Development*
   set Framework Preset to **Other** (vercel.json also sets this).
2. *Storage > Create > Blob*, access **Public**, connect it to the project.
   This adds `BLOB_READ_WRITE_TOKEN` automatically.
3. *Settings > Environment Variables*: add `ADMIN_PASSWORD` (and optionally
   `ADMIN_USER`, default `corinne`).
4. Deploy. Go to `/admin`, log in, upload the portfolio and the info PDF once.

## For Corinne

Open https://www.corinne-futterlieb.com/admin, log in, pick a PDF under
"Portfolio" or "Info", click *Hochladen*. Done; the site shows it immediately.

## Local development

```
npm install
npx vercel link && npx vercel env pull   # gets the Blob token
ADMIN_PASSWORD=test npx vercel dev
```
