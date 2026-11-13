# shop.830productions.com

The 830 Productions Shop: LUT packs and merch on a product shelf, with Stripe checkout and the shared
830 Productions login (Firebase).

Built with Next.js, TypeScript, Tailwind and Motion, and exported as a fully static site.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

| What | Where |
| --- | --- |
| Products, prices, colors, Stripe Payment Links | `lib/products.ts` |
| The shelf and product pages | `components/ui/product-shelf.tsx` |
| Header, footer, home layout | `components/site/` |
| Login and account pages | `app/login/`, `app/account/` |
| Firebase login and orders | `lib/firebase.ts` |
| Brand colors and fonts | `app/globals.css` |
| Photos, cut-outs, logos | `public/img/` |

Every product gets its own page at `/<slug>` (for example `/desk-mat`), which opens the shelf with that
product already out. The build writes these as `desk-mat.html` and so on, so the old `.html`
addresses keep working.

## Adding a product

1. Add an entry to `PRODUCTS` in `lib/products.ts` and its Stripe Payment Link to
   `STRIPE_PAYMENT_LINKS` under the same `linkId`.
2. Put its photos in `public/img/products/<slug>/`.
3. Add a cut-out for the shelf: a PNG with a transparent background in `public/img/cutouts/`. On a
   Mac, open the photo in Preview and use **Tools → Remove Background**, or long-press the subject in
   Photos and copy it. Set `cutoutRatio` to its width divided by its height.

## Deploying

`npm run build` writes the whole site to `out/`. Pushing to `main` runs
`.github/workflows/deploy.yml`, which builds the site and publishes `out/` to GitHub Pages
(Settings → Pages → Source must be **GitHub Actions**). Vercel can also deploy it as a normal
Next.js project.
