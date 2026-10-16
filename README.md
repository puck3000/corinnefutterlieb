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

## Where things live

| What | Where |
| --- | --- |
| Vercel project | `cf-new` (team "Daniel Lerch's projects"), deploys `master` automatically |
| Domains | `www.corinne-futterlieb.com`, `corinne-futterlieb.com` redirects to www (308) |
| PDF storage | Vercel Blob store `cf-dateien` (public) |
| Admin login | user `corinne`, passphrase in env var `ADMIN_PASSWORD` |
| Archive of the old setup | [Google Drive folder](https://drive.google.com/drive/folders/1et5mooILUS8ek8zBYK4lNXUNs9Ko53kc?usp=sharing), see below |

## Changing the admin passphrase

Use five random words, separated by hyphens, without umlauts
(for example from your password manager's passphrase generator).
Words are easy to dictate on the phone and to type on a mobile.

1. Replace the variable. The second command asks for the new value.
   ```
   npx vercel env rm ADMIN_PASSWORD production
   npx vercel env add ADMIN_PASSWORD production
   ```
   Or in the dashboard: *cf-new > Settings > Environment Variables > ADMIN_PASSWORD > Edit*.
2. Redeploy. **Without a redeploy the old passphrase keeps working.**
   In the dashboard open *Deployments*, pick the latest production deployment and
   choose *Redeploy*. Alternatively run `npx vercel --prod` from a clean `master`.
3. Check: `/admin` must reject the old passphrase and accept the new one.
4. Give Corinne the new passphrase by phone, in person or via a disappearing
   message. Never in the same mail as the URL and username.

## Archive of the old setup

Until October 2026 the site ran on Next.js (Vercel project `cf_refresh`, repo
`puck3000/cf_refresh`) with Sanity as CMS. Before that it was a Nuxt site with its
own Sanity project; that code is kept in this repo under the git tag `legacy-nuxt-sanity`.

Both Sanity datasets were exported on 16 October 2026, with all documents and all
uploaded PDFs, to this
[Google Drive folder](https://drive.google.com/drive/folders/1et5mooILUS8ek8zBYK4lNXUNs9Ko53kc?usp=sharing):

| File | Content |
| --- | --- |
| `sanity-zm1c5kla.tar.gz` | Sanity project of the Next.js site (2024 to 2026) |
| `sanity-fimh6ppz.tar.gz` | Sanity project of the first Nuxt version (2019) |
| `LIESMICH.txt` | Short description of the archive |

Each archive contains `data.ndjson` (all documents), `assets.txt` (original file URLs)
and `files/` (the PDFs, named by asset ID).

## One-time setup on Vercel (for a fresh project)

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
npm run dev:local        # http://localhost:3000  and  /admin (corinne / test)
```

Without a Blob token, the site, the redirects and the admin login work, but uploads fail.
To test uploads, put a token from a Blob store into `.env.local`:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
ADMIN_PASSWORD=whatever
```

The token is under *Storage > your Blob store > .env.local* in the Vercel dashboard,
or run `npx vercel link && npx vercel env pull`. Use a separate test store if you
do not want to touch production files. `npm run dev` runs the official `vercel dev` instead.
