# XIV Todays Frontline

A Vite+ / Vue Vapor / TypeScript static app for GitHub Pages that shows the current Final Fantasy XIV Frontline map rotation.

## GitHub Pages

https://Hoshik1ra.github.io/xiv-todays-frontline/

The Vite base path is configured as `/xiv-todays-frontline/`.

## Tech Stack

- Vue Vapor with TSX through `vue-jsx-vapor`
- `vue-i18n` for `zh-CN` and `en-US`
- `mdui` Material Design 3 web components
- Tailwind CSS
- Day.js
- Vite+ toolchain

## Commands

```bash
vp install
vp dev
vp run typecheck
vp run build
```

If `vp` is not available yet, install Vite+ first:

```powershell
irm https://vite.plus/ps1 | iex
```

## Deployment

GitHub Actions builds the app with Vite+ and deploys the generated `dist` directory to GitHub Pages.
