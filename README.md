This is a [Next.js](https://nextjs.org) project (**App Router**) for Noisy by Nature.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Analytics, Speed & Tag Management

This repo includes lightweight, optional measurement hooks. Until you add env vars, **no Google tags** are injected.

### Vercel Analytics & Speed Insights

- Packages: `@vercel/analytics` and `@vercel/speed-insights` are mounted from `app/layout.tsx`.
- In the **[Vercel project](https://vercel.com) → Settings**: enable **Analytics** and **Speed Insights** for production data.
- Locally, Web Analytics stays quiet unless you configure it per Vercel docs; Speed Insights can show limited local data.

### Google Tag Manager (recommended path)

1. Create a container in [Google Tag Manager](https://tagmanager.google.com) and copy its ID (`GTM-XXXXXXX`).
2. In `.env.local` (and Vercel **Environment Variables** for Production):

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

3. Deploy/restart dev. Tags (GA4, pixels, Ads) are wired **inside GTM**, not duplicated in Next.js.

### GA4 — two supported modes (never both)

| Mode | When to use | Env |
|------|-------------|-----|
| **Via GTM** (default recommandé) | You run GA4 Configuration + conversions tags in GTM; ideal pour **YouTube Ads** liées à GA4 | Only `NEXT_PUBLIC_GTM_ID` |
| **Direct gtag via Next** | Pas de GTM; chargement officiel `@next/third-parties` | Only `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (format `G-XXXXXXXXXX`) |

**Do not set both:** if `NEXT_PUBLIC_GTM_ID` is present, **`NEXT_PUBLIC_GA4_MEASUREMENT_ID` is ignored** in code to prevent double-counting.

### Évènements marketing (Conversion API / dataLayer plus tard)

Dans une **client component**, après interaction utilisateur :

```ts
import { sendGTMEvent } from "@next/third-parties/google";

sendGTMEvent({ event: "purchase_complete", ecommerce: { /* … */ } });
```

### Fichiers concernés par la mesure

| File | Role |
|------|------|
| [`app/layout.tsx`](app/layout.tsx) | Imports `Analytics`, `SpeedInsights`, `MeasurementBootstrap` |
| [`components/MeasurementBootstrap.tsx`](components/MeasurementBootstrap.tsx) | Conditional GTM / GA4 from `@next/third-parties/google` |
| [`.env.example`](.env.example) | Documents `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_GA4_MEASUREMENT_ID` |
| [`package.json`](package.json) | Dependencies for Vercel + third-parties |

## Deploy on Vercel

Deploy from this repo or import it on [Vercel](https://vercel.com/new). Mirror `.env.example` secrets in the Vercel dashboard.
