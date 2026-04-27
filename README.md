# Dungeon Shift

Playable browser prototype for a top-down action RPG.

## Local development

```powershell
npm install
npm run dev
```

Open the local Vite URL, usually `http://localhost:5173/`.

## Build

```powershell
npm run build
```

The production files are generated in `dist/`.

## Environment

Create a `.env` file with:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The `.env` file is intentionally ignored by git.

## Online deploy

This repo includes a GitHub Pages workflow. Add these repository secrets before deploying:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Then enable GitHub Pages with "GitHub Actions" as the source.
