# Deploy — Vercel (Docusaurus)

Single source of truth: this folder (`docs/docusaurus/`). Local `npm run start` and Vercel must build **the same project**.

## Vercel project settings

| Setting | Value |
|---------|--------|
| **Root Directory** | `docs/docusaurus` |
| **Framework Preset** | Other (or Docusaurus if listed) |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |
| **Install Command** | `npm install` |
| **Node.js** | 20.x |

`vercel.json` in this folder mirrors these values.

## Verify production matches local

After deploy, check:

| Page | URL |
|------|-----|
| Homepage (Supported Agents) | https://mantle-forge.vercel.app/ |
| Plugins overview | https://mantle-forge.vercel.app/docs/plugins/ |
| Install Hermes | https://mantle-forge.vercel.app/docs/plugins/install-hermes |
| Introduction | https://mantle-forge.vercel.app/docs/intro |

Navbar must show: **Docs · Plugins · Quickstart · Skills · Tools · Demo**

Sidebar under **Plugins** must list six install guides.

## If Vercel looks older than local

1. **Vercel dashboard** → latest deployment → status must be **Ready** (not Error).
2. **Hard refresh** browser: `Ctrl+Shift+R` (Windows) or empty cache.
3. Confirm URL is `mantle-forge.vercel.app` (not an old preview URL).
4. **Redeploy** → Deployments → ⋮ → Redeploy (with "Use existing build cache" **unchecked**).

## Run locally (must match Vercel)

If the sidebar is missing **Plugins**, the dev server is using stale cache:

```bash
cd docs/docusaurus
npm install
npm run start:clean
```

Open http://localhost:3000/docs/plugins/ — sidebar must show **Plugins** with six install guides.

## Build locally before push

```bash
cd docs/docusaurus
npm install
npm run build:clean
```

Build must finish with `SUCCESS` and no broken links.

## Common build failure

`Docusaurus found broken links` — usually `./intro` when intro used `slug: /`.  
Fix: intro at `/docs/intro`; link with `[Introduction](./intro)`.
