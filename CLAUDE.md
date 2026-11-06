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
npm test           # Run the Vitest suite once
npm run test:watch # Re-run tests on change
npm run generate-icons   # Regenerate logo SVGs from scripts/generate-pwa-icons.js
npm run generate-png-assets # Rebuild the banner, PNG icons and favicon.ico from the SVGs
```

Node 22 is required (`.nvmrc`, `netlify.toml`). ESLint and Prettier are configured (`npm run lint`, `npm run format:check`).

## Testing

Tests live in `tests/` and run with Vitest and happy-dom, without booting Nuxt: `#imports` is aliased to `tests/stubs/nuxt-imports.js`, and `tests/helpers/withSetup.js` mounts a composable so its lifecycle hooks fire. Add a stub there when a tested composable needs another Nuxt auto-import. `tests/data/docs.test.js` checks every `docs.json` entry against the real PDFs, so it catches a wrong or missing paper. Components and the PDF rendering itself aren't covered, so check those in a browser with `npm run preview`.

## Architecture

This is effectively a **single-page app with one root component**. There is no `pages/` directory and no Vue Router navigation — `app/app.vue` is the entire application shell. It instantiates every composable once and wires them together by passing refs/functions between them (manual dependency injection), then passes state down to presentational child components via props and receives events back.

When changing app-wide behavior, expect to touch `app/app.vue` plus the relevant composable — the component tree below it is mostly presentational.

### Composables (`app/composables/`) hold all state

State lives in composables, not in a store. Two patterns coexist:

- **Self-contained** (e.g. `useTheme`, `useToast`, `useSidebar`, `useComparison`, `useDocsCache`) — create their own refs internally.
- **Dependency-injected** (e.g. `useSearch(data, ...)`, `useNavigation(data, selectedPdf, selectPdf, ...)`, `usePdfViewer(isDesktop, showToastNotification)`) — receive state/callbacks from `app.vue` so they can react to shared state.

`usePdfViewer` exposes `createXxx(ref)` factory functions (`createSelectPdf`, `createScrollToTop`, `createHandleScroll`) because those behaviors need DOM refs that only exist in `app.vue` after mount. Follow this factory pattern rather than reaching into the DOM from inside the composable.

### Content is data-driven via `public/docs.json`

The sidebar tree, navigation order, and available PDFs all come from `public/docs.json`, a 3-level tree: **category → year → subject**. Each leaf has `{ label, pdf, icon }`. `useNavigation` flattens this tree into a linear list for prev/next arrows, so the order in `docs.json` defines navigation order.

To add an exam paper:

1. Drop the PDF at `public/pdfs/{category}/{year}/{subject}.pdf`.
2. Add a leaf entry to `public/docs.json` pointing at it.
3. If it's a new subject/category, add its emoji/gradient in `app/constants/icons.js`.

### URLs and history

There is no router: `useReaderHistory` drives the History API directly. The open document lives in the `?pdf=` query param, Back walks through opened documents and closes overlays (drawer, comparison, PDF picker), and the last position is saved in `localStorage` (`dobpi_reading_position`). All `?pdf=` URLs share the `/` HTML shell, so the Service Worker's navigation route matches with `ignoreSearch`.

### Splash screen

`AppSplash` is server-rendered so it paints before JavaScript, and `useSplashScreen` removes it once the reader is ready, capped at 2.2s so a slow PDF never holds it up. It shows once per session: the inline script in `nuxt.config.ts` hides it before first paint on later loads. Its CSS fail-safe animation clears it if JavaScript fails, so the `Transition` around it needs `type="transition"` or Vue waits for that animation and the invisible splash blocks taps.

### SEO

`useSeo` sets titles, descriptions, canonicals and JSON-LD from the document in the URL (`urlPdf`), not the open document: `/` opens the first exam but stays the homepage, so the default document must never rewrite the URL. Document URLs must come from `getDocPath` (`app/utils/docUrl.js`) so links, canonicals and the sitemap match exactly. The sitemap is `server/routes/sitemap.xml.js`, built from `docs.json` and prerendered. `useDocsCache` starts from the bundled `docs.json` so the server can render every document link. The sidebar shows one category at a time as tabs (`CategoryTabs`), but `CategoryList` renders a tab panel per category and hides the others with `v-show`, never `v-if`, so every subject link stays in the server HTML.

### Caching is multi-layered — keep the layers in sync

1. **`useDocsCache`** starts from the bundled `docs.json`, then caches the fetched copy in `localStorage` for 24h (`bacii_docs_data` / `bacii_docs_version`) and does stale-while-revalidate: serves cache instantly, refreshes in background.
2. **Service Worker** (`app/service-worker/sw.js`, built by `@vite-pwa/nuxt` in `injectManifest` mode — see `pwa` in `nuxt.config.ts`) — Workbox precaches every build asset (hashed JS/CSS chunks including the lazy `vue-pdf-embed` chunk, fonts, icons) and versioning is automatic per build; no manual cache-version bumps. Runtime routes: PDFs are cache-first in the **unversioned `dobpi-pdfs` cache, shared with `useOfflineDownload`** (the names must stay in sync; `useOfflineDownload` is created once in `app.vue` and its `cachedPdfs` set drives the sidebar's per-paper "saved" stamps), `docs.json` is stale-while-revalidate, navigations are network-first with `/` warmed at install as the offline fallback.
3. **Netlify CDN headers** (`netlify.toml`) — long immutable caching for `/pdfs`, JS/CSS, fonts; stale-while-revalidate for `/docs.json`.

The Service Worker only runs against a real build — test it with `npm run preview`, not `npm run dev`.

### Other conventions

- Composables are `.js` (not TS) and use `<script setup>` in components.
- Styling is TailwindCSS with a 1970s Khmer print design. Colours are semantic tokens: `--c-*` CSS variables (RGB channels) in `app/assets/css/main.css`, exposed as Tailwind colours (`bg-surface`, `text-fg`, `bg-active`, `text-system`, `bg-ink-bar`…). Dark mode is class-based, toggled/persisted by `useTheme` (`theme` localStorage key), and only redefines the variables under `.dark`, so components rarely need `dark:`. "Where you are" is `active` (not `current`, which clashes with Tailwind's `text-current`).
- Reuse the component classes in `main.css` (`.btn`, `.btn-ink`, `.btn-outline`, `.btn-system`, `.btn-icon`, `.stamp`, `.sheet`, `.ink-chip`) and patterns (`.bg-halftone`, `.bg-ruled`, `.bg-rays`). Shadows are only `shadow-print-sm` (3px) and `shadow-print` (8px), with no blur. Controls are at least 44px.
- Fonts are self-hosted in `public/fonts/` (OFL, split into Khmer/Latin subsets) so they work offline: `font-sans` Battambang for body text (16px, line-height 1.7), `font-display` Moul for headings at 16px or more only, `font-numeral` Koulen for numbers and stamps, `font-mono` Special Elite for **Latin text only** (it has no Khmer glyphs). Write numbers with `toKhmerDigits` and year labels with the helpers in `app/utils/khmer.js`.
- PDF page frames are a box-shadow ring on `.vue-pdf-embed__page`, not a border, so they take no layout space (`useFitPdfWidth` and the scroll anchors depend on that).
- Icons come from `@lucide/vue`; subject emojis and category gradient classes are centralized in `app/constants/icons.js`.
- The Service Worker is registered automatically by `@vite-pwa/nuxt` (`registerType: 'autoUpdate'`). All SEO/OG/PWA meta tags live in `nuxt.config.ts` `app.head`; the PWA manifest is the hand-maintained `public/manifest.json` (`pwa.manifest: false`).

> Note: `README.md` is extensive but has partially drifted from the code (some component names and the theme color differ). Treat the actual files as source of truth.
