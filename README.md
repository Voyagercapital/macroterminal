# Macro Terminal (PWA) — GitHub Pages

A lightweight, phone-friendly **macro risk dashboard** designed to feel like a mini Bloomberg: refreshable, multi‑region, and built to run as an iPhone “Add to Home Screen” web app.

## How it works (secure on GitHub Pages)
GitHub Pages is static, so **API keys can’t be kept secret in the browser**. Instead, this repo uses a scheduled GitHub Action to fetch data and write it into `public/data/dashboard.json`, which the front-end loads.

- `scripts/refresh_data.py`: pulls data (FRED + RBNZ out of the box) and computes signals
- `Refresh data` workflow: runs daily and commits updated JSON
- `Build & Deploy` workflow: builds the PWA and deploys to GitHub Pages

## Quick start
1. Create a new repo on GitHub and push this folder.
2. In **Settings → Pages**, set **Source = GitHub Actions**.
3. In **Settings → Secrets and variables → Actions**, add:
   - `FRED_API_KEY` (required for most US/global series)
4. Go to **Actions**, run **Refresh data** once (workflow_dispatch), then run **Build & Deploy**.
5. Open the Pages URL on iPhone → **Share → Add to Home Screen**.

## Adding / editing indicators
Edit `scripts/indicators.json`. Each entry becomes one row in the dashboard and contributes to the overall risk score.

Sources implemented in v0.1:
- `fred` — FRED API series observations
- `rbnz_xlsx` — RBNZ statistical spreadsheets (via “data file index” links)

Planned next: add SDMX (ECB/OECD/IMF/BIS) adapters and ACLED for event‑based geo risk.

## Notes
- This is a **daily** refresh by default (cron in `.github/workflows/data-refresh.yml`).
- If you want near-real-time (intraday), you’ll need a small backend (Cloudflare Worker / Vercel) or more frequent actions.
