# Vercel ↔ GitHub (same setup as [pomodoro](https://github.com/jaKasienka/pomodoro))

This project lives on the **improvement1** team in Vercel—the same place as **pomodoro** (`pomodoro-jet-zeta.vercel.app`).

| Setting | Value |
| --- | --- |
| Vercel project | `circular-devices` |
| Team | `improvement1` |
| GitHub repo | `jaKasienka/circular-devices` |
| Production URL | [https://circular-coral.vercel.app](https://circular-coral.vercel.app) |

Build settings come from `vercel.json` (`pnpm install`, `pnpm run build:client`, output `dist/spa`).

## Enable auto-deploy on push (match pomodoro)

**Status:** `jaKasienka/circular-devices` is connected to Vercel project `circular-devices`. Pushes to `main` trigger production builds.

If you need to reconnect, CLI `vercel git connect` requires GitHub to allow **this repository** for the Vercel app.

1. Open **[GitHub → Settings → Applications → Installed GitHub Apps](https://github.com/settings/installations)** (sign in as **jaKasienka**).
2. Click **Vercel** → **Configure**.
3. Under **Repository access**, either:
   - **All repositories**, or  
   - **Only select repositories** → add **`circular-devices`** (keep **pomodoro** selected if you use that mode).
4. Save.

Then connect from the repo root:

```bash
npx vercel link --project circular-devices --yes
echo y | npx vercel git connect https://github.com/jaKasienka/circular-devices
```

5. In [Vercel → circular-devices → Settings → Git](https://vercel.com/improvement1/circular-devices/settings/git), confirm **Production Branch** is `main`.

The next push to `main` should build automatically (you’ll see a `circular-devices-git-main-improvement1.vercel.app` style preview URL like pomodoro).

## If connect still fails

- Confirm the repo URL is exactly `jaKasienka/circular-devices` (public).
- In Vercel, use **Add New → Import** the repo once (avoid duplicate projects—or delete the unused CLI-only project first).
- Team **improvement1** may require an **owner** to approve GitHub app changes or create deploy tokens.

## Manual deploy (until Git is linked)

```bash
npx vercel link --project circular-devices --yes
npx vercel --prod
```
