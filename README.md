# Circular Devices

Mobile-first UX prototype for **hardware lifecycle diagnostics**, **certified recycling**, and **certified data erasure**. One smartphone guides another (typically older) device through scan → seal → ship → audit—with simulated logistics and payouts for portfolio demos.

| | |
| --- | --- |
| **Live prototype** | [https://circular-coral.vercel.app](https://circular-coral.vercel.app) |
| **Case study** | [Circular Devices — Katharina Cembik](https://www.cembik.com/selected-projects/circular-devices) |
| **Source** | [github.com/jaKasienka/circular-devices](https://github.com/jaKasienka/circular-devices) |

> **Disclaimer:** This build does not collect personal data. Scans, carriers, quotes, and payments are fixtures. Copy illustrates intended production flows only.

## What this prototype shows

### Straightforward trust flow (recycle)

Users see a clear **chain of custody**: appraise on scan, order a **tamper-evident seal**, configure and **review shipment** before the label, then optional **audit video** while **payout and certificate process** (review is optional—not a gate to getting paid).

### Erase-only path — strongly recommended

After scan, users can choose **certified memory deletion** (**$25** service, **device returned**) instead of recycle-for-cash. The erase path uses the same trust layer (seal, ship, audit) but **no recycle payout**—recommended when data risk matters. Try **Google Pixel 8** from **My Devices** or pick erase on the scan result screen.

### Product direction (backend not in this repo)

The **intended platform** will intake **all kinds of end-of-life hardware**—devices that are **no longer circulating**, never entered a resale loop, or sit “dead” in a drawer—not only phones actively being traded. This repository is the **front door UX**: flows, tokens, and interaction architecture; production would add vision/LLM identification, handlers, chain-of-custody, and inventory.

## Quick start

Requires [pnpm](https://pnpm.io) and Node 20+.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:8080](http://localhost:8080). Layout is tuned for **375×812** mobile viewports.

```bash
pnpm typecheck   # TypeScript + design token generation
pnpm test        # Vitest
pnpm build:client
```

## Demo script (My Devices)

| Device | Story |
| --- | --- |
| Galaxy S21 | Audit-ready — waiting icon, bell “final”, optional video |
| iPhone 13 mini | Seal arrived → continue ship flow |
| Google Pixel 8 | Deletion-only / erasure service path |
| Motorola Edge 40 | Seal delivery wait |
| iPhone XR | Completed summary |

**Home → Scan now** starts a fresh Galaxy S21 run (`fresh=1`). Reload the page resets the default list script; closing scan with ✕ keeps progress in session storage until reload.

## Stack

- **Frontend:** React 18, TypeScript, React Router 6, Vite, Tailwind CSS 3, Radix UI
- **Design system:** Brandcyan JSON tokens → generated CSS variables (`tokens/`, `pnpm tokens:generate`)
- **Backend (optional):** Express integrated in dev; demo routes under `/api/`. The live Vercel deploy is a **static SPA** (`dist/spa`).

## Project layout

```
client/          React SPA (pages, scan flow, UI)
server/          Express (dev + production Node entry)
shared/          Shared TypeScript types
tokens/          Brandcyan primitive/semantic/typography tokens
scripts/         Token generation
```

## Deploy on Vercel

Hosted on the same Vercel team as [pomodoro](https://github.com/jaKasienka/pomodoro): project **`circular-devices`** → **[circular-coral.vercel.app](https://circular-coral.vercel.app)**.

`vercel.json` sets `pnpm install`, `pnpm run build:client`, output `dist/spa`, and SPA rewrites.

**Auto-deploy from GitHub (recommended):** grant the Vercel GitHub app access to this repo, then connect Git—step-by-step in [`docs/VERCEL-GITHUB-SETUP.md`](docs/VERCEL-GITHUB-SETUP.md).

**Manual deploy:**

```bash
npx vercel link --project circular-devices --yes
npx vercel --prod
```

## License

Portfolio / case study use unless otherwise noted. Contact via [cembik.com](https://www.cembik.com).
