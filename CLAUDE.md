# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bacii (a.k.a. "Dobpi") is a Nuxt 4 / Vue 3 PWA for viewing Cambodian national exam papers (បាក់ឌុប) as PDFs. UI text is in Khmer. Deployed to Netlify at https://dobpi.netlify.app. No backend — all content is static files served from `public/`.

## Commands

```bash
npm run dev        # Dev server at http://localhost:3000
npm run build      # Production build -> .output/public (what Netlify publishes)
npm run preview    # Serve the production build locally (required to test the Service Worker)
npm run generate   # Static site generation
npm run generate-icons   # Regenerate PWA icons from scripts/generate-pwa-icons.js
```

Node 22 is required (`.nvmrc`, `netlify.toml`). There is no test suite and no linter configured.

## Architecture

This is effectively a **single-page app with one root component**. There is no `pages/` directory and no Vue Router navigation — `app/app.vue` is the entire application shell. It instantiates every composable once and wires them together by passing refs/functions between them (manual dependency injection), then passes state down to presentational child components via props and receives events back.

When changing app-wide behavior, expect to touch `app/app.vue` plus the relevant composable — the component tree below it is mostly presentational.

### Composables (`app/composables/`) hold all state

State lives in composables, not in a store. Two patterns coexist:

- **Self-contained** (e.g. `useTheme`, `useToast`, `useSidebar`, `useComparison`, `useDocsCache`) — create their own refs internally.
- **Dependency-injected** (e.g. `useSearch(data, ...)`, `useNavigation(data, selectedPdf, selectPdf, ...)`, `usePdfViewer(isDesktop, showToastNotification)`) — receive state/callbacks from `app.vue` so they can react to shared state.

`usePdfViewer` exposes `createXxx(ref)` factory functions (`createToggleFullscreen`, `createScrollToTop`, `createHandleScroll`) because those behaviors need DOM refs that only exist in `app.vue` after mount. Follow this factory pattern rather than reaching into the DOM from inside the composable.

### Content is data-driven via `public/docs.json`

The sidebar tree, navigation order, and available PDFs all come from `public/docs.json`, a 3-level tree: **category → year → subject**. Each leaf has `{ label, pdf, icon }`. `useNavigation` flattens this tree into a linear list for prev/next arrows, so the order in `docs.json` defines navigation order.

To add an exam paper:

1. Drop the PDF at `public/pdfs/{category}/{year}/{subject}.pdf`.
2. Add a leaf entry to `public/docs.json` pointing at it.
3. If it's a new subject/category, add its emoji/gradient in `app/constants/icons.js`.

### Caching is multi-layered — keep the layers in sync

1. **`useDocsCache`** caches `docs.json` in `localStorage` for 24h (`bacii_docs_data` / `bacii_docs_version`) and does stale-while-revalidate: serves cache instantly, refreshes in background.
2. **Service Worker** (`public/sw.js`) — custom, hand-written, with four named caches keyed off `CACHE_VERSION` (`dobpi-vN`). **Any change to cached assets or to `sw.js` itself requires bumping `CACHE_VERSION`** or clients will keep stale caches; old caches are purged on activate only when the version string changes.
3. **Netlify CDN headers** (`netlify.toml`) — long immutable caching for `/pdfs`, JS/CSS, fonts; stale-while-revalidate for `/docs.json`.

The Service Worker only runs against a real build — test it with `npm run preview`, not `npm run dev`.

### Other conventions

- Composables are `.js` (not TS) and use `<script setup>` in components.
- Styling is TailwindCSS; dark mode is class-based and toggled/persisted by `useTheme` (`theme` localStorage key). Global styles/animations live in `app/assets/css/main.css`.
- Icons come from `@lucide/vue`; subject emojis and category gradient classes are centralized in `app/constants/icons.js`.
- The Service Worker is registered via an inline script in `nuxt.config.ts` `app.head.script`, which is also where all SEO/OG/PWA meta tags live.

> Note: `README.md` is extensive but has partially drifted from the code (some component names and the theme color differ). Treat the actual files as source of truth.
