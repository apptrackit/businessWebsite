# Velox Sites — Astro + React Three Fiber

Soft-Tech Hybrid landing page with:

- Ghost White (`#F4F4F9`) base and Eerie Black (`#1A1A1A`) typography
- Glassmorphism cards (`backdrop-filter: blur(12px)` + `1px rgba(255,255,255,0.2)` border)
- Floating 3D icosahedron hero artifact with mouse follow, idle rotation, and scroll-driven distortion
- Magnetic custom cursor for outbound profile links
- Astro View Transitions enabled

## Config-first business logic

All core copy and design flags are mapped from [src/config/config.json](src/config/config.json).

Update this single file to change:

- `company.name`
- `company.links.botond` / `company.links.bence`
- `locales.en` / `locales.hu` hero copy and CTA text
- `design.primaryColor`
- `design.threeJsIntensity`

## Local development

From project root:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## GitHub Pages deployment (official Astro flow)

This repo includes [deploy workflow](.github/workflows/deploy.yml) for `gh-pages` via GitHub Pages Actions.

1. Build command is `npm run build`.
2. Update `site` in [astro.config.mjs](astro.config.mjs) to your real GitHub Pages origin (example: `https://yourname.github.io`).
3. Keep `base` aligned with your repository name (already handled automatically in Actions using `GITHUB_REPOSITORY`).
4. Push to `main` to trigger deployment.

If Pages is not yet enabled, enable **Settings → Pages → Build and deployment: GitHub Actions**.
# businessWebsite
