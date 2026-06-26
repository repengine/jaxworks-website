# JaxWorks LLC Website

Static one-page website for a pressure washing / exterior cleaning company, with a
Cloudflare Worker backend for estimate requests.

Open `index.html` in a browser to view the static page. The estimate form backend runs
when deployed through Cloudflare Workers.

## Business Details

- Business name: `JaxWorks LLC`
- Phone: `904-891-1355`
- Email/form submission destination: `jaxworks@yahoo.com`
- Service area: `Jacksonville, Beaches, Mandarin, Ponte Vedra, Fleming Island, Orange Park, Julington Creek, St. Johns, Nocatee, and surrounding communities`
- Licensing: `Licensed and insured`

## Future Updates

- Service list and FAQ answers as the company offerings get more specific
- `assets/hero-pressure-washing.jpg` if your friend has real job photos
- Before/after result photos in `assets/results/`

## Cloudflare Deployment

This repo is configured for Cloudflare Workers with Static Assets:

- `wrangler.toml` declares the Worker, static asset binding, and `/api/*` routing.
- `worker/index.js` serves static assets and routes `/api/estimate`.
- `scripts/build.js` copies only public site files into `dist/`.
- `wrangler.toml` serves static assets from `dist/`, not the repo root.
- `.assetsignore` is kept as a backup guard for Worker asset uploads.

Cloudflare build settings:

- Build command: `exit 0`
- Deploy command: `npm run deploy`

Do not use `npx wrangler versions upload` for the production deploy command. That only uploads
a version/preview; it does not move production traffic by itself.

If a previous Worker preview uploaded repo internals, remove that preview/deployment in
Cloudflare and redeploy with this `dist/` configuration. Verify `/.git/config` returns `404`.

## Email Backend

The quote form posts to `/api/estimate`, routed through `worker/index.js` to
`functions/api/estimate.js`. Configure these Cloudflare Worker environment variables:

- `RESEND_API_KEY`: secret API key from Resend.
- `ESTIMATE_FROM_EMAIL`: verified sender, for example `JaxWorks LLC <estimates@jaxworks.com>`.
- `ESTIMATE_TO_EMAIL`: optional override; defaults to `jaxworks@yahoo.com`.
- `ESTIMATE_EMAIL_SUBJECT`: optional override; defaults to `JaxWorks LLC free estimate request`.

The customer email is used as the email `Reply-To`, so replies from the inbox go back to
the person requesting the estimate.

## Files

- `index.html` contains the page structure and copy.
- `styles.css` contains the responsive design.
- `script.js` controls the mobile menu, comparison slider, and AJAX estimate form submit.
- `worker/index.js` routes Cloudflare Worker requests.
- `scripts/build.js` creates the public `dist/` deployment folder.
- `functions/api/estimate.js` sends estimate request emails.
- `wrangler.toml` configures Cloudflare Workers static assets.
- `assets/logo.jpg` is the original supplied logo.
- `assets/logo-cropped.jpg` is the cropped web copy used by the page.
- `assets/hero-pressure-washing.jpg` is the local hero image.
- `assets/Images/` contains the original before/after uploads.
- `assets/results/` contains optimized, purpose-named copies used by the page.
