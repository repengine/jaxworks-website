# JaxWorks LLC Website

Static one-page website for a pressure washing / exterior cleaning company, with a
Cloudflare Pages Function for estimate requests.

Open `index.html` in a browser to view the static page. The estimate form backend runs
when deployed on Cloudflare Pages or through `wrangler pages dev`.

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

## Cloudflare Form Backend

The quote form posts to `/api/estimate`, implemented in `functions/api/estimate.js`.
Deploy the site to Cloudflare Pages and configure these environment variables:

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
- `functions/api/estimate.js` sends estimate request emails from Cloudflare Pages.
- `assets/logo.jpg` is the original supplied logo.
- `assets/logo-cropped.jpg` is the cropped web copy used by the page.
- `assets/hero-pressure-washing.jpg` is the local hero image.
- `assets/Images/` contains the original before/after uploads.
- `assets/results/` contains optimized, purpose-named copies used by the page.
