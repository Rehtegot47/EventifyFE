# Deploying the Eventify frontend

Vite SPA, deployed on Vercel. Framework preset is auto-detected
(`npm run build` → `dist`).

## Environment variables

Vite **inlines these at build time**, so they must exist before the first build
and a change requires a redeploy — not a page reload. A missing variable does
not fail the build; it produces a site that loads and then silently calls the
wrong host.

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | the backend, including `/api/v1` |
| `VITE_WHATSAPP_NUMBER` | business number, international format, no `+` or spaces |
| `VITE_GOOGLE_MAPS_API_KEY` | optional — maps simply do not render without it |

Note that anything prefixed `VITE_` is **embedded in the public bundle** and
readable by anyone. That is correct for an API URL and a business phone number;
never put a real secret behind that prefix.

`api.js` falls back to `http://localhost:8080/api/v1` when `VITE_API_BASE_URL`
is unset, so a forgotten variable shows up only in the browser, never in the
build log.

## Why `vercel.json` exists

Routing is client-side (`BrowserRouter`), so the server must return
`index.html` for every path. Without the rewrite, any URL other than `/`
returns 404 on a hard refresh or a shared link — including
**`/payment/success`, where Paystack redirects buyers after a successful
charge**. A paying customer would land on a 404 with their money already taken.

The file also sets caching: Vite fingerprints asset filenames so those are
immutable, while `index.html` must never be cached or buyers keep loading a
stale bundle after a deploy.

**`vercel.json` accepts no comments.** Vercel validates it against a strict
schema and rejects unknown properties, including the `"//"` key sometimes used
as a JSON comment convention. A rejected file is not partially applied — the
rewrite silently does not happen, which presents as unexplained 404s.

## After deploying

The backend needs the new origin, or the browser blocks every API call:

```
CORS_ALLOWED_ORIGINS=https://<app>.vercel.app
FRONTEND_URL=https://<app>.vercel.app
APP_BASE_URL=https://<app>.vercel.app
```

`APP_BASE_URL` builds password-reset links, so it takes the **frontend** URL
despite the name suggesting otherwise.

## Verifying a deployment

Checking that the site loads is not enough — the first build of this project
loaded fine while serving the wrong commit with no environment variables.

1. A deep link returns 200, not 404:
   `https://<app>.vercel.app/payment/success`
2. The bundle carries the right backend. View source, open the `/assets/*.js`
   files, and search for the API host. Finding `localhost` means the
   environment variable was missing at build time.
