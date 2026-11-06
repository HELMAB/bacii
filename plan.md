# Plan: migrate Dobpi to the 1970s Khmer print design

Design reference (source of truth for visuals): https://claude.ai/artifact/BoiW1BCW2NQn66e1fyHmmN
Boards: Desktop reader · Mobile splash / empty state · Mobile drawer · Mobile reader · Mobile reader (dark) · Style tile · States & overlays.

This plan moves the current gray/blue Tailwind UI to that design without changing app behaviour: same composables, same URLs, same Service Worker contract, same SEO output. It is ordered so each phase builds on the previous one and leaves the app working.

---

## 0. Ground rules

- **Behaviour stays the same.** Routing (`useReaderHistory`), SEO (`useSeo`, `getDocPath`, sitemap), caching (`useDocsCache`, `sw.js`, `netlify.toml`) and keyboard shortcuts must not change. The only logic changes are listed explicitly (category tabs, per-paper "saved" status, Khmer number formatting, search highlighting).
- **Offline must keep working.** Every new font and asset is self-hosted under `public/` so the Service Worker serves it offline. No Google Fonts CDN at runtime.
- **Crawlable links stay in the DOM.** Subject `<a :href="getDocPath(...)">` links must stay rendered (hidden with `v-show`, never `v-if`) for **both** categories, even when a tab is not selected.
- **Accessibility floor:** text contrast ≥ 4.5:1, touch targets ≥ 44px, Khmer body text ≥ 16px with line-height ≥ 1.6, Moul only at ≥ 16px.
- **No emoji in UI chrome.** Icons stay `@lucide/vue` (or inline SVG for the logo).
- Work on a branch: `feat/retro-ui`. Merge to `master` only when every phase is done (no half-migrated UI in production). Sub-PRs into `feat/retro-ui` are fine.

---

## Phase 1: Prepare (half a day)

1. `git checkout -b feat/retro-ui` from `master`.
2. Baseline checks, all must pass before starting:
   ```bash
   npm ci
   npm test
   npm run lint
   npm run format:check
   npm run build && npm run preview
   ```
3. Take "before" screenshots with `npm run preview` at 390×844, 768×1024 and 1440×900, light and dark, for: reader, drawer open, search, comparison, PDF selector modal, loading, error, offline banner, install prompt. Save them outside the repo (for the PR description).
4. Record a Lighthouse run (mobile) for accessibility and performance so we can compare later.

---

## Phase 2: Design tokens (Tailwind + CSS variables)

The current UI doubles every colour with `dark:` variants. The new design uses semantic tokens backed by CSS variables, so most components need one class instead of two and dark mode is defined in one place.

### 2.1 Token values

| Token (CSS var)                      | Light                 | Dark                    | Use                                                                  |
| ------------------------------------ | --------------------- | ----------------------- | -------------------------------------------------------------------- |
| `--c-page`                           | `#EADBB8`             | `#14100C`               | App background behind surfaces                                       |
| `--c-surface`                        | `#F1E4C6`             | `#2A1D14`               | Sidebar, header bars on paper, cards                                 |
| `--c-surface-raised`                 | `#FBF5E6`             | `#33241A`               | Inputs, sheets, menus, dialogs                                       |
| `--c-fg`                             | `#2A1D14`             | `#F1E4C6`               | Body text, borders, hard shadows (light)                             |
| `--c-fg-muted`                       | `#5A4632`             | `#D9C7A0`               | Secondary text (7.1:1 / 9.8:1)                                       |
| `--c-fg-faint`                       | `#6E5B45`             | `#A8957A`               | Placeholders, disabled                                               |
| `--c-line`                           | `#2A1D14`             | `#6E5B45`               | 2px borders, dashed dividers                                         |
| `--c-shadow`                         | `#2A1D14`             | `#000000`               | Offset print shadows                                                 |
| `--c-active`                         | `#9E2F18`             | `#E2735A`               | "Where you are": active tab, current paper, counters (5.8:1 / 5.3:1) |
| `--c-on-active`                      | `#F1E4C6`             | `#1C130D`               | Text on `--c-active`                                                 |
| `--c-highlight`                      | `#E0A526`             | `#E0A526`               | Search match `<mark>` only                                           |
| `--c-system`                         | `#245A57`             | `#5FA39E`               | Offline, saved, system messages                                      |
| `--c-on-system`                      | `#F1E4C6`             | `#14100C`               | Text on `--c-system`                                                 |
| `--c-ink-bar`                        | `#2A1D14`             | `#1C130D`               | Top header, bottom ink chips                                         |
| `--c-on-ink-bar`                     | `#F1E4C6`             | `#F1E4C6`               | Text on header                                                       |
| `--c-reader`                         | `#2F6E6A`             | `#14100C`               | Reader background (under halftone)                                   |
| `--c-halftone-dot`                   | `rgb(20 52 50 / .25)` | `rgb(47 110 106 / .35)` | Halftone dots                                                        |
| `--c-turmeric` / `--c-brick` (fixed) | `#E0A526` / `#9E2F18` | same                    | Decorative zigzag strip only                                         |

Before committing, re-check every text/background pair with a contrast checker; the numbers above are from the design review. Check `--c-system` dark `#5FA39E` with `--c-on-system` and on `--c-surface`; adjust if below 4.5:1.

### 2.2 `app/assets/css/main.css`

1. Add a `@layer base` block with `:root { --c-...: R G B; }` and `.dark { ... }` using **space-separated RGB channels** (e.g. `--c-fg: 42 29 20;`) so Tailwind opacity modifiers work.
2. Replace the focus ring: `*:focus-visible { outline: 3px solid rgb(var(--c-active)); outline-offset: 2px; }`.
3. Replace scrollbar colours with `--c-fg-faint` / `--c-fg-muted`.
4. Body: `font-family: theme(fontFamily.sans); font-size: 16px; line-height: 1.7; background: rgb(var(--c-page)); color: rgb(var(--c-fg));`.
5. Add pattern utilities in `@layer components` (exact CSS from the canvas files):
   - `.bg-zigzag`: turmeric triangles on brick, `20px` tile. Always fixed colours.
   - `.bg-halftone`: `radial-gradient(circle, rgb(var(--c-halftone-dot)) 1.3px, transparent 1.6px) 0 0/8px 8px, rgb(var(--c-reader))`.
   - `.bg-ruled`: `repeating-linear-gradient(to bottom, transparent 0 43px, rgb(36 90 87 / .22) 43px 44px)`; the 44px period **must** equal the ledger row height.
   - `.bg-rays`: `repeating-conic-gradient(from 0deg at 50% 38%, #E0A526 0 9deg, #E9B94A 9deg 18deg)`.
   - `.bg-diamonds`: the diamond rule used under exam headers.
6. Add reusable component classes in `@layer components`, so templates stay short:
   - `.btn`: `inline-flex items-center justify-center gap-2 min-h-11 px-4 border-2 border-line font-bold text-base transition-[transform,box-shadow]`, plus `active:translate-x-[2px] active:translate-y-[2px] active:shadow-none` for a "pressed print" feel. Wrap motion in `motion-safe:`.
   - `.btn-ink`: `bg-fg text-surface shadow-print-sm` with brick shadow colour (`shadow-[3px_3px_0_rgb(var(--c-active))]`).
   - `.btn-outline`: `bg-transparent text-fg`.
   - `.btn-system`: `bg-system text-on-system shadow-print-sm`.
   - `.btn-icon`: `w-11 h-11 p-0` (44px), `.btn-icon-lg`: `w-12 h-12`.
   - `.stamp`: `inline-block px-1.5 border-2 font-numeral text-sm leading-normal -rotate-[5deg]` (colour set by modifier `.stamp-system` / `.stamp-active`).
   - `.sheet`: `bg-surface-raised border-2 border-line shadow-print`.
   - `.ink-chip`: `h-11 px-4 inline-flex items-center bg-ink-bar text-on-ink-bar border-2 border-surface`.
7. Style the PDF pages rendered by `vue-pdf-embed` (global CSS, not scoped):
   ```css
   .vue-pdf-embed__page {
     border: 2px solid rgb(var(--c-line));
     box-shadow: 8px 8px 0 rgb(var(--c-shadow));
     margin-bottom: 32px;
   }
   .dark .vue-pdf-embed__page canvas {
     filter: sepia(0.12) brightness(0.9);
   }
   ```
   `app/utils/pdfScroll.js` measures pages with `getBoundingClientRect`, so borders and margins don't break scroll anchors. Verify by reloading mid-document (Phase 10 checklist).

### 2.3 `tailwind.config.js`

1. Remove the `primary` palette **at the end of Phase 6** (keep it during migration so unmigrated components still compile). Track leftovers with `grep -rn "primary-" app`.
2. Add semantic colours (named `active`, not `current`, because Tailwind already has `text-current` etc. for `currentColor`), each `rgb(var(--c-x) / <alpha-value>)`: `page`, `surface`, `surface-raised`, `fg`, `fg-muted`, `fg-faint`, `line`, `shadow`, `active`, `on-active`, `highlight`, `system`, `on-system`, `ink-bar`, `on-ink-bar`, `reader`. Also fixed colours `brick: '#9E2F18'`, `turmeric: '#E0A526'`.
3. `boxShadow`: `'print-sm': '3px 3px 0 rgb(var(--c-shadow))'`, `print: '8px 8px 0 rgb(var(--c-shadow))'`. These are the **only** two shadow sizes.
4. `fontFamily`:
   - `sans: ['Battambang', 'PengHuoth', 'sans-serif']` (body)
   - `display: ['Moul', 'serif']` (headings ≥ 16px only)
   - `numeral: ['Koulen', 'sans-serif']` (Khmer numbers, stamps, counters)
   - `mono: ['"Special Elite"', 'monospace']` (**Latin text only**: "DOBPI", hex codes)
5. `borderWidth` is default (2px exists). Add `spacing: { 11: '2.75rem' }` if not present (Tailwind 3 has `11`).
6. Remove `backgroundImage.dots` / `dots-dark` once `bg-halftone` replaces every use (`PdfContainer`, `EmptyState`, `ComparisonPanel`).
7. Content globs: `./app/**/*` already covers everything; no change.

**Done when:** `npm run build` passes and a scratch element using `bg-surface text-fg shadow-print font-display` renders correctly in light and dark.

---

## Phase 3: Fonts (self-hosted, offline-safe)

1. Download the woff2 files (all SIL Open Font License) for:
   - **Moul** 400 (Khmer + Latin subsets)
   - **Koulen** 400 (Khmer + Latin)
   - **Battambang** 400 and 700 (Khmer + Latin)
   - **Special Elite** 400 (Latin only)

   Use the `@fontsource/*` npm packages as the download source (`npm pack @fontsource/moul` and copy the files) or google-webfonts-helper. **Don't** add them as runtime dependencies.

2. Place them at `public/fonts/<Family>/<Family>-<Weight>-<subset>.woff2` (same pattern as `public/fonts/PengHuoth/`), and add each family's `OFL.txt` next to it.
3. Add `@font-face` rules in `main.css` (`@layer base`), one per file, with `font-display: swap` and `unicode-range` per subset:
   - Khmer subset: `U+1780-17FF, U+19E0-19FF, U+200B-200D, U+25CC`
   - Latin subset: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`

   This way a Khmer-only screen doesn't download Latin files and vice versa.

4. Preload the two fonts visible on first paint, in `nuxt.config.ts` → `app.head.link`:
   `{ rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/Battambang/Battambang-400-khmer.woff2', crossorigin: '' }` and the same for Moul.
5. Service Worker: no code change is needed. `/fonts/` already has a `CacheFirst` route (`dobpi-fonts`), and `injectManifest.globPatterns` includes `woff2`, so the files are also precached. After building, confirm the new font URLs appear in `.output/public/sw.js`'s manifest.
6. Netlify: confirm `netlify.toml` gives `/fonts/*` long immutable caching (add a header block if missing).
7. Keep PengHuoth as the fallback in `fontFamily.sans` until Phase 10. Then decide: remove `public/fonts/PengHuoth` and its `@font-face`, or keep it. Removing it saves its precache bytes.
8. Measure: total font bytes for a first visit (Network tab, `npm run preview`). Budget **≤ 250 KB** for Khmer subsets. If over, drop Special Elite (it's decorative) and use Koulen for the Latin "DOBPI" label.

**Done when:** in DevTools → Network → Offline, a reload after one online visit renders Moul/Koulen/Battambang (not a system fallback).

---

## Phase 4: Shared helpers and logic (with tests first)

Write tests first in `tests/utils/` and `tests/composables/`, then the code.

### 4.1 `app/utils/khmer.js` (new) and `tests/utils/khmer.test.js`

- `toKhmerDigits(value)`: `'2022'` / `2022` → `'២០២២'`; leaves non-digits untouched (`'100%'` → `'១០០%'`).
- `parseYearLabel(label)`: from a `docs.json` year label returns `{ year: '២០១៤', round: 'លើកទី ១' | null }`.
  - `'វិញ្ញាសាប្រឡងឆ្នាំ២០១៤ (លើកទី ០១)'` → `{ year: '២០១៤', round: 'លើកទី ១' }` (strip the leading zero `០១` → `១`)
  - `'វិញ្ញាសាប្រឡងឆ្នាំ២០២២'` → `{ year: '២០២២', round: null }`
  - Labels are Khmer digits already; also accept Latin digits defensively.
- `formatSubjectCount(n)`: `8` → `'៨ មុខវិជ្ជា'`.
- `formatYearShort(label)`: `'វិញ្ញាសាប្រឡងឆ្នាំ២០២២'` → `'ឆ្នាំ២០២២'` (`'ឆ្នាំ២០១៤ លើកទី ១'` for two-session years). Used in the header subtitle.
- Add a data test in `tests/data/docs.test.js`: every year label in `public/docs.json` parses to a non-empty `year`. This catches a new label format breaking the ledger.

### 4.2 `app/utils/highlight.js` (new) and `tests/utils/highlight.test.js`

- `splitMatch(text, query)` → `[{ text, match: boolean }]`, case-insensitive, matching what `useSearch` already filters on (`label.toLowerCase().includes(query)`). Empty query → one non-match segment.
- Rendered in the template as `<mark>` segments. **Never** use `v-html`.

### 4.3 `useSidebar` → category tabs

The design replaces the category accordion with two tabs. Keep `expandedCategories` (so `useSearch` and `openInitialDoc` keep working), but make exactly one category "active":

- Add `activeCategory` (`shallowRef('')`) and `selectCategory(label)`, which sets `expandedCategories[label] = true`, sets every other category to `false` and **keeps** `expandedYears` (switching tabs shouldn't lose the open year).
- Keep `toggleCategory` for backwards compatibility, but nothing in the new UI calls it. Remove it in Phase 10 if unused.
- **Remove compact mode.** `isCompactMode` has no toggle in the UI (`toggle-compact-mode` is never emitted), and the ledger needs fixed 44px rows. Delete `isCompactMode`, its `localStorage` key handling (`compactMode`), and the prop from `app.vue` → `SidebarMain` → `CategoryList`. Add a one-time `localStorage.removeItem('compactMode')` in `onMounted`.
- New test `tests/composables/useSidebar.test.js` (mount with `withSetup`):
  - `selectCategory` activates only that category
  - selecting a category keeps the expanded year
  - the default active category is the first one when nothing is selected

`app.vue` changes:

- `openInitialDoc`: replace `expandedCategories[doc.category] = true` with `selectCategory(doc.category)`.
- Add a `watch(selectedCategory, (c) => c && selectCategory(c))` so prev/next across the category boundary (paper 69 → 70) switches the tab, and also `expandedYears[selectedYear] = true` so the current paper is visible.
- Default (no doc yet): `activeCategory = data.value[0]?.label`. Tabs follow `docs.json` order (សង្គម first).

### 4.4 Per-paper "saved offline" status

The ledger shows a teal "បានទាញយក" stamp on papers cached for offline. `useOfflineDownload` only exposes `cachedCount` today, and it is instantiated inside `OfflineDownload.vue`.

1. In `useOfflineDownload.js`, add `cachedPdfs = shallowRef(new Set())`. Fill it in `checkStatus` (it already loops `cache.match(url)`) and add to it as `downloadAll` completes each URL. Replace the Set (don't mutate it) so watchers fire.
2. Add `markCached(url)` for single papers. A paper opened in the reader is cached by the SW `CacheFirst` route, so after `onPdfLoaded` in `app.vue` call `checkStatus([url])` or `markCached(url)` after confirming `caches.match`.
3. Follow the app's DI pattern (CLAUDE.md): call `useOfflineDownload()` **once in `app.vue`**. Pass `cachedPdfs` to `SidebarMain` → `CategoryList`, and pass the download state/actions to `OfflineDownload.vue` as props/events instead of the component calling the composable itself.
4. Update `tests/composables/useOfflineDownload.test.js`: `cachedPdfs` holds exactly the cached URLs after `checkStatus` and after `downloadAll`; cancelling keeps already-cached entries.

**Done when:** `npm test` passes with the new tests, and the app still behaves exactly as before (no visual changes yet).

---

## Phase 5: Component migration (one component per commit)

Order: outer shell first (what users see most), then states and overlays. For each component: replace classes with tokens, apply the markup from the matching canvas board, keep every `aria-*`, `emit`, prop and `v-show`/`v-if` contract unless stated, and check it in light and dark at 390px and 1440px.

### 5.1 `app/app.vue` (shell)

- Root: `bg-gray-50 dark:bg-gray-950` → `bg-page text-fg`.
- Mobile backdrop: `bg-black/50` → `bg-ink-bar/55`.
- Extract the inline page indicator into `components/PdfViewer/PageIndicator.vue` (5.11).
- Pass the new props: `selectedCategory` to `ReaderTopBar`; `cachedPdfs`, `activeCategory` and `@select-category` to `SidebarMain`; offline-download state to `SidebarMain` → `OfflineDownload`.
- Toast messages: remove the emoji prefixes (`'📊 '`, `'✓ '`) at lines ~320–341. The toast component draws its own icon.

### 5.2 `ReaderTopBar.vue` (Desktop reader + Mobile reader boards)

- Container: `h-14 bg-white/90 ... border-b` → `bg-ink-bar text-on-ink-bar px-2.5 sm:px-6 py-2 sm:py-3`, no blur. Add a sibling `<div class="bg-zigzag h-2.5 sm:h-3.5" aria-hidden="true">` directly under the header (inside the reader column, so it never covers controls).
- Drawer button: `.btn-icon` with `border-2 border-on-ink-bar/50`, Menu icon 20–22px. Keep `aria-expanded`.
- Brand block (desktop, `hidden sm:flex`): 48px stamp SVG using `LETTER_PATH` from `constants/logo.js` (circle `fill: --c-active`, dashed paper ring, paper letter), plus "បាក់ឌុប" in `font-display text-xl` and "DOBPI" in `font-mono text-xs tracking-[3px] text-on-ink-bar/80`. Make the stamp/wordmark a small `components/BrandStamp.vue` (it's reused by the splash, empty state and install prompt).
- Title: `font-display text-base sm:text-xl leading-[1.7] truncate` = subject; subtitle `text-[13px] sm:text-sm text-on-ink-bar/80` = `${categoryShort} · ${formatYearShort(selectedYear)}`. `categoryShort` strips the `ថ្នាក់` prefix ("វិទ្យាសាស្ត្រពិត"). Drop the subject icon (the design has none). New prop: `selectedCategory`.
- Zoom group (`hidden sm:flex`): 44×44 buttons, percentage in `font-numeral text-lg` via `toKhmerDigits(zoomPercent)`, dashed dividers.
- Download: `.btn .btn-outline` with paper text and a paper/50 border, 48px tall, label visible from `md`. Icon-only 44px on mobile, keeping `aria-label="ទាញយក"`.
- Theme toggle: when `hasPdf`, it lives only in the overflow menu (all sizes, matching the design). When `!hasPdf` (no menu), keep the standalone 44px button.
- `HeaderActionsDropdown` → 5.3.

### 5.3 `HeaderActionsDropdown.vue` (States board #7)

- Toggle: square `.btn-icon-lg` with ⋯ (`Ellipsis` icon), no text label or chevron. Add `aria-haspopup="menu"`, keep `aria-expanded` and the label "បើកម៉ឺនុយសកម្មភាព".
- Menu: `w-60 bg-surface-raised border-2 border-line shadow-print` (dark shadow is black via token). Items `min-h-11 px-3.5 text-base gap-2.5`, separated by `border-b border-dashed border-line`. Hover: `bg-highlight/25`.
- Mobile zoom row: keep, restyle with Koulen digits.
- Comparison "កំពុងប្រើ" badge → `.stamp .stamp-system`.
- Bonus a11y while here: arrow-key navigation between `role="menuitem"` items and focus the first item on open. The current menu has neither.

### 5.4 `Sidebar/SidebarMain.vue` (Desktop reader + Mobile drawer)

- Panel: `bg-white ... border-r` → `bg-surface border-r-4 border-double border-line`. Width stays `w-80 sm:w-96` (design 330–340px fits).
- Header:
  - Desktop: `<h2 class="font-display text-[22px] leading-[1.7] text-active">ឯកសារប្រឡង</h2>` and `<p class="text-sm text-fg-muted">សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ</p>`.
  - Mobile: an ink bar (`bg-ink-bar text-on-ink-bar`) with the title in `font-display text-lg` and a **new close button** (`.btn-icon`, `aria-label="បិទ"`, emits `closeSidebar`; today the drawer can only be closed by the backdrop or Back), plus a zigzag strip under it.
- Insert `CategoryTabs` (5.5) between `SearchBar` and the list. Hide it while `searchQuery` is non-empty.
- Keep the scroll structure (desktop: nav scrolls, chrome pinned; mobile: all scrolls, `OfflineDownload` sticky bottom).

### 5.5 `Sidebar/CategoryTabs.vue` (new)

- Props: `categories` (the full `data`, for order and labels), `activeCategory`. Emits `select`.
- Markup: `role="tablist" aria-label="ថ្នាក់"`, a 2-column grid; each tab is a `<button role="tab" :aria-selected :aria-controls="panelId" :tabindex="active ? 0 : -1">`, `min-h-12 border-2 border-line font-bold text-base`. Active: `bg-active text-on-active`. Inactive: `bg-surface-raised`.
- Label: strip the `ថ្នាក់` prefix ("វិទ្យាសាស្ត្រសង្គម" / "វិទ្យាសាស្ត្រពិត"). Same labels on desktop and mobile.
- Keyboard: ←/→ moves focus and selects (WAI-ARIA automatic-activation tabs). Home/End jump to first/last.
- `CategoryList` renders **one `role="tabpanel"` per category, all in the DOM**, toggled with `v-show` so every subject link stays crawlable and SSR output still contains all document links.

### 5.6 `Sidebar/CategoryList.vue` → year ledger (Desktop reader + Mobile drawer)

Rewrite the template; keep the props/emits contract (minus `isCompactMode`, plus `cachedPdfs`, `activeCategory`).

- **Normal mode** (no search): for each category render `<div role="tabpanel" v-show="category.label === activeCategory" class="bg-ruled border-t border-[rgb(36_90_87/.22)]">`.
  - **Year row** (`<button :aria-expanded>`), exactly `h-11` (44px) to stay on the ruled grid:
    - left margin column `w-[72px] sm:w-[84px] h-11 border-r-2 border-active text-active flex flex-col items-center justify-center`, with `font-numeral text-lg leading-none` = `parseYearLabel().year`, plus `text-xs font-bold` = `round` when present (2014 sessions)
    - then `flex-1 pl-4 text-[15px] text-fg-muted` = `formatSubjectCount(year.children.length)` (bold, `text-fg` when expanded)
    - then a chevron (`ChevronRight` collapsed, `ChevronDown` expanded)
    - give the button an `aria-label` with the full year label (`year.label`) so screen readers still hear "វិញ្ញាសាប្រឡងឆ្នាំ…".
  - **Subjects** (`<ol v-show="expandedYears[year.label]">`), each `<li class="h-11 flex items-center">`: an empty margin cell (same width, `border-r-2 border-active`, `aria-hidden`), then the existing `<a :href="getDocPath(subject.pdf)" @click.exact.prevent=...>`. Label `${toKhmerDigits(i + 1)}. ${subject.label}`, `whitespace-nowrap truncate` with `title` (long labels must not wrap and break the 44px grid).
    - Current (`selectedPdf === subject.pdf`): `h-9 mx-3 px-3 bg-active text-on-active font-bold shadow-print-sm`, `aria-current="page"`.
    - Saved (`cachedPdfs.has(subject.pdf)`): append `<span class="stamp stamp-system" aria-hidden="true">បានទាញយក</span>` and set `aria-label="${label} — បានទាញយក"` on the `<a>`.
    - Other: `text-fg hover:bg-highlight/20`.
- **Search mode** (`searchQuery` non-empty; tabs hidden): render results from `filteredData` grouped under a small category heading (`text-sm font-bold text-fg-muted`), one row per subject: `<a>` with `splitMatch(subject.label, query)` segments (`<mark class="bg-highlight text-fg px-0.5">`), and the year on the right in `font-numeral text-active`. This matches States board #4.
- **No results:** dashed `border-2 border-dashed border-line` box, title "រកមិនឃើញលទ្ធផល" in `font-display text-base`, hint "សាកល្បងឈ្មោះមុខវិជ្ជា ឬឆ្នាំ ដូចជា «២០២២»" (States board #5). Keep `role="status"`.
- Remove the `extractYear` import if unused (keep the helper; it's tested).

### 5.7 `Sidebar/SearchBar.vue`

- Keep `defineModel`, the `/` placeholder logic and Escape clearing.
- Box: `h-11 flex items-center gap-2 px-3 bg-surface-raised border-2 border-line shadow-print-sm`. Input `text-base` (16px, which also stops iOS zoom on focus), placeholder `text-fg-faint`.
- Visible `<label>` "ស្វែងរក" on desktop (`hidden lg:block text-sm font-bold text-fg-muted`). Keep the `aria-label`.
- Clear button: 44px hit area inside the box (`-mr-3 w-11 h-11`).
- The `/` shortcut in `useKeyboardShortcuts` focuses the input: check it still finds it after the markup change.

### 5.8 `Sidebar/OfflineDownload.vue`

Receives state via props (Phase 4.4). Card: `m-4 sm:mx-6 p-4 border-2 border-dashed border-system bg-surface-raised`.

- Idle / partial: title "អានពេលគ្មានអ៊ីនធឺណិត" (`font-bold text-system`), "បានរក្សាទុក ${toKhmerDigits(cached)} / ${toKhmerDigits(total)}", a 10px progress bar (`border-2 border-system`, fill `bg-system`), and the `.btn .btn-system w-full` "ទាញយកទាំងអស់" button (opens the existing confirm step).
- Confirm: keep the MB estimate text. `.btn-system` "ទាញយក" + `.btn-outline` "បោះបង់".
- Downloading: striped animated fill (`motion-safe:` animation), live text `role="status"`, cancel `.btn-outline`.
- Complete: `.stamp .stamp-system` "បានទាញយកទាំងអស់" + count.
- Error: failed count in `text-active` (not `text-red-500`).
- Mobile (`<lg`): the compact single row from the drawer board (text + 44px icon button), still sticky at the bottom.

### 5.9 `DisclaimerNotice.vue`, `PeaceBanner.vue`, `AppFooter.vue`

- Disclaimer: `bg-surface-raised border-t-2 border-line`, Info icon `text-system`, Khmer text `text-sm leading-[1.7]` (was 12px, too small for Khmer), English `text-[13px] text-fg-muted`.
- PeaceBanner: the current blue/red explicitly references the Cambodian flag. Keep that meaning: an ink card (`bg-ink-bar text-on-ink-bar`) topped with a 3-stripe flag band (blue `#032EA1` / red `#E00025` / blue, 4px each, `aria-hidden`). **Owner decision needed** if a different treatment is wanted.
- Footer: `bg-surface border-t-2 border-line text-fg-muted text-[13px]`. GitHub link keeps its 44px hit area. Replace the `❤` glyph with a Lucide `Heart` icon (`fill-current text-active`, `aria-label="love"` or keep as decorative with the text).

### 5.10 Reader surface: `PdfContainer.vue`, `PdfLoadOverlay.vue`, `EmptyState.vue`

- `PdfContainer`: `bg-gray-100 ... bg-dots` → `bg-halftone`. Bottom padding must clear the mobile bottom bar: `pb-[calc(72px+24px)] sm:pb-24`. PDF page frames come from the global CSS in 2.2 step 7. Don't touch `useFitPdfWidth`/`BASE_PDF_WIDTH`; the 2px border adds 4px to the page box. Confirm the page still fits at 390px (adjust `px-2` → `px-3` if the shadow clips; the shadow needs 8px of right padding).
- `PdfLoadOverlay` (States boards #1, #2):
  - Loading: `bg-halftone` overlay with a centered `.sheet` card (`w-60 p-5`): "កំពុងផ្ទុក" + `font-numeral` percent via `toKhmerDigits`. Bar: `h-3.5 border-2 border-line bg-surface`, fill `bg-fg` with diagonal stripes. When `loadProgress === null`, an indeterminate striped animation (`motion-safe`). Keep `role="status"`. The skeleton lines become ink bars at 16% opacity inside a `.sheet`.
  - Error: a rotated `.stamp` "បរាជ័យ" (`border-[3px] border-active text-active text-xl`, `aria-hidden`), title `font-bold text-[17px]`, help text `text-fg-muted`, `.btn .btn-ink` "ព្យាយាមម្ដងទៀត" with the RotateCw icon. Keep `role="alert"` and the offline wording branch.
- `EmptyState` (Mobile splash / empty-state board): `bg-rays`, a centered `BrandStamp` (152px), "បាក់ឌុប" in `font-display text-5xl leading-[1.5]` with a 3px paper text-shadow, and an ink ribbon "វិញ្ញាសាប្រឡងទុតិយភូមិ" (`font-display text-base -rotate-2 shadow-print-sm`). Under it, a dashed ink-bordered card with "ចុច [Menu icon] ដើម្បីជ្រើសរើសឯកសារ". Loading branch: the same striped bar as the splash with "កំពុងរៀបចំវិញ្ញាសា…". **Note:** `/` normally opens the first exam (SEO rule), so this screen is mainly seen while `docs.json` loads or if it's empty.

### 5.11 Floating reader controls: `PdfPager.vue`, new `PageIndicator.vue`, `ScrollToTopButton.vue`

- `PdfPager` (keep props/emits, `disabled` logic, `title` shortcuts, aria-labels):
  - Desktop (`sm:`): floating ticket `absolute bottom-6 left-1/2 -translate-x-1/2 flex border-2 border-line bg-surface-raised shadow-print-sm`. Prev: `min-h-12 px-4 font-bold` text "មុន" + ChevronLeft. Counter: `font-numeral text-lg px-3.5 border-x-2 border-dashed border-line` = `toKhmerDigits(\`${i + 1} / ${total}\`)`. Next: `bg-fg text-surface`"បន្ទាប់" + ChevronRight, with`shadow-[3px_3px_0_rgb(var(--c-active))]`.
  - Mobile (`<sm`): a full-width bar `absolute inset-x-0 bottom-0 h-[72px] grid grid-cols-3 bg-surface border-t-4 border-double border-line`. The counter cell stacks the Koulen number in `text-active` over "វិញ្ញាសា" (`text-xs text-fg-muted`). Next is an inset ink button (`m-2.5`).
  - Disabled: `opacity-40 cursor-not-allowed`, no shadow.
- `PageIndicator.vue` (new, replaces the inline `<div>` in `app.vue`): `.ink-chip` with "ទំព័រ" + `<b class="font-numeral text-lg">` = `toKhmerDigits(\`${current} / ${total}\`)`. Position `absolute left-4 bottom-[92px] sm:left-6 sm:bottom-6`. Keep the fade transition and `v-if="totalPages > 0 && !isLoading"`. Consider `aria-live="polite"` with debounce, or leave it silent (page changes on scroll would be noisy). Decide during implementation; default silent.
- `ScrollToTopButton`: `.btn-icon-lg bg-surface-raised text-fg border-2 border-line shadow-print-sm`. Position `bottom-[92px] right-4 sm:bottom-6 sm:right-6`. Keep `aria-label="ឡើងទៅលើ"`.
- Make sure the pager, page chip and scroll-top don't overlap at 390px and at 768px.

### 5.12 `AppSplash.vue` (Mobile splash board)

Constraints from CLAUDE.md that must survive: server-rendered, no JS needed, the `.splash-seen` early-hide class, the 5s CSS fail-safe animation, the `app-splash-leave-*` classes used by the `Transition type="transition"` in `app.vue`, landscape and `prefers-reduced-motion` rules.

- Background: the rays pattern (`repeating-conic-gradient`) on turmeric, with a 14px zigzag strip at the top.
- Replace the record/beads SVG with the stamp logo (152px circle in brick, dashed paper ring, paper `LETTER_PATH`, 3px ink outline). Title: keep `TITLE_PATH` but fill it ink with a paper offset (swap the current red/white/black layers to ink/paper).
- Tagline as an ink ribbon (`-rotate-2`), Moul ≥ 16px: keep the existing text "ឯកសារប្រឡងឥតគិតថ្លៃ" (it's the product promise; the board shows a variant).
- Progress: an indeterminate striped bar (pure CSS animation) replaces the spinning beads. Disable it under `prefers-reduced-motion`.
- Footer strip: paper band with "DOBPI.NETLIFY.APP" in Special Elite (Latin only).
- Dark: `--c-page` night background, rays at lower contrast (`#3A2A12` / `#2E2110`), and paper/ink inverted on the stamp ring.
- The splash only uses inline SVG and CSS. Moul for the ribbon may not be loaded yet on first paint, so the ribbon must look acceptable in the fallback font (or render the ribbon text as part of the SVG outline, like the logo, if the FOUT looks bad).
- Re-run `tests/composables/useSplashScreen.test.js` (logic unchanged).

### 5.13 Messages: `ToastNotification.vue`, `OfflineIndicator.vue`, `PWAInstallPrompt.vue` (States boards #3, #6)

- Toast: `bg-ink-bar text-on-ink-bar px-4 py-2.5 shadow-[3px_3px_0_rgb(var(--c-system))]`, Check icon, `text-[15px]`. Keep position and transitions. Add `role="status"` (missing today).
- OfflineIndicator:
  - Offline bar: `bg-system text-on-system border-b-2 border-line`, WifiOff icon (drop `animate-pulse` or wrap it in `motion-safe:`), `text-[15px]`, `role="status"`.
  - Back online: `bg-surface text-system border-b-2 border-dashed border-system` with a check icon.
- PWAInstallPrompt: `bg-surface border-t-2 border-line`. Replace the GraduationCap tile with `BrandStamp` (56px). Title `font-bold text-base`, text `text-sm text-fg-muted leading-[1.6]`. Install: `.btn .btn-ink`. Close: `.btn-icon .btn-outline`. Keep all `localStorage` logic.

### 5.14 Comparison: `ComparisonView.vue`, `ComparisonPanel.vue`, `PdfSelectorModal.vue` (States board #8)

- ComparisonView header: `bg-surface border-b-2 border-line px-3.5 py-2`, title `font-display text-base`. Swap: `.btn .btn-outline` with the Lucide `ArrowLeftRight` icon (replace the `⇄` glyph) "ប្តូរ". Exit: `.btn .btn-ink` "ចេញ". Panel grid: no gap; on desktop the divider is `border-r-4 border-double border-line` on panel 1.
- ComparisonPanel: `bg-halftone` scroller. Header label chip: `.sheet`-style `h-8 px-2.5` with `font-numeral text-active` number + "title · year" (use `formatYearShort`). "ផ្លាស់ប្តូរ" becomes `.btn .btn-outline` (44px). Empty state: dashed box + text. Zoom buttons: 44px `.btn-icon` in a bordered group with `shadow-print-sm`.
- PdfSelectorModal: backdrop `bg-ink-bar/60`; dialog `bg-surface border-2 border-line shadow-print max-w-4xl`. Header: ink bar with `font-display` title and a paper close `.btn-icon`. Category sections use the same `CategoryTabs` component (consistency, shorter list). Each year heading: Koulen year + session. Subject buttons: `min-h-11 border-2 border-line bg-surface-raised shadow-print-sm hover:bg-highlight/25` with the subject icon in `text-active`. Bonus while touching it: close on Escape and trap focus inside the dialog (Back already closes it via `useReaderHistory`).

---

## Phase 6: Remove the old palette

1. `grep -rnE "primary-|gray-|bg-white|text-white|amber-|red-500|bg-dots" app` must return nothing except the intentional fixed flag colours in `PeaceBanner`.
2. Delete `primary` and the `dots` background images from `tailwind.config.js`.
3. `npm run build` (Tailwind purges unknown classes silently, so check visually too).

---

## Phase 7: Theme colours, PWA metadata and static assets

1. `useTheme.js`: `THEME_COLOR_LIGHT = '#2A1D14'` (matches the ink header), `THEME_COLOR_DARK = '#1C130D'`.
2. `nuxt.config.ts`: `theme-color` meta `#2A1D14`. Consider `apple-mobile-web-app-status-bar-style: 'black-translucent'` only if the header handles the safe-area inset (otherwise keep `default`).
3. `public/manifest.json`: `theme_color: "#2A1D14"`, `background_color: "#E0A526"` (turmeric, so the Android launch screen matches the rays splash). Increment nothing else.
4. Icons: the current generated icons (`scripts/generate-pwa-icons.js`) use `#c7231f` / `#e8c34a`. Update their colours to brick `#9E2F18` / turmeric `#E0A526` / ink `#2A1D14` for consistency, then run `npm run generate-icons` and `npm run generate-png-assets`. Check `favicon.svg`, `apple-touch-icon.png`, maskable icons and `og-image.png` visually. **Optional:** only if the owner wants the brand colours to shift; otherwise leave icons alone.
5. The SW needs no change: build hashes version everything automatically.

---

## Phase 8: Dark mode pass

Go through every component in dark mode at 390px and 1440px:

- Current item uses `#E2735A` with `#1C130D` text (never brick `#9E2F18` on ink: 2.76:1, fails).
- Shadows are black (`--c-shadow`). Borders use `--c-line` `#6E5B45`, so they don't glare.
- Halftone uses the dark variant. The PDF canvas dim filter is applied.
- The zigzag strip keeps fixed brick/turmeric (it's decorative, acceptable in both themes).
- The splash dark variant (5.12) and the theme flash script in `nuxt.config.ts` still work (no light flash on reload in dark).

---

## Phase 9: Tests, lint and docs

1. Unit tests (Vitest, happy-dom):
   - `tests/utils/khmer.test.js` (4.1)
   - `tests/utils/highlight.test.js` (4.2)
   - `tests/composables/useSidebar.test.js` (4.3)
   - updated `tests/composables/useOfflineDownload.test.js` (4.4)
   - `tests/data/docs.test.js` year-label parsing (4.1)
   - Existing suites (`useNavigation`, `useReaderHistory`, `useSeo`, `useSearch`, `useSplashScreen`, `sitemap`, `pdfScroll`) must pass unchanged. That proves behaviour didn't move.
2. `npm run lint`, `npm run format` then `npm run format:check`.
3. Docs:
   - `CLAUDE.md` → "Other conventions": replace the Tailwind/dark-mode bullet with the token system (`--c-*` variables in `main.css`, semantic Tailwind colours, `.btn`/`.stamp`/`.sheet` component classes, two shadow sizes, fonts and their roles, "Special Elite is Latin-only", "Moul ≥ 16px", "Khmer digits via `toKhmerDigits`").
   - Mention `CategoryTabs` and that all tab panels stay in the DOM for crawlers (SEO section).
   - Mention `cachedPdfs` and that `useOfflineDownload` is now instantiated in `app.vue`.
   - Update `README.md` screenshots/theme colour if it documents them.

---

## Phase 10: Manual verification (`npm run build && npm run preview`)

Components and PDF rendering aren't covered by tests, so walk through this checklist in Chrome and Safari (or iOS simulator):

**Layout and visuals** (390×844, 768×1024, 1440×900; light and dark)

- [ ] Header: logo, title/subtitle truncation with a long subject ("សីលធម៌-ពលរដ្ឋ"), zoom, download, ⋯ menu.
- [ ] Ledger rows sit exactly on the ruled lines all the way down (expand several years).
- [ ] 2014 shows two rows with "លើកទី ១ / ២".
- [ ] Current paper highlighted; downloaded papers show the stamp.
- [ ] Desktop pager stays visible while scrolling a long PDF. On mobile the bottom bar doesn't cover the last page (padding). The page chip and scroll-top don't overlap.
- [ ] Moul text never clips (stacked Khmer subscripts need line-height ≥ 1.6).

**Behaviour**

- [ ] Open via `/` (first exam, URL unchanged), via `?pdf=` deep link, via sidebar, via prev/next. Crossing from the last សង្គម paper to the first ពិត paper switches the tab.
- [ ] Back closes the drawer, the comparison and the PDF picker, then walks history.
- [ ] Search: typing hides the tabs, shows highlighted results from both categories, Escape clears, `/` focuses. No-results state.
- [ ] Reading position restores after reload mid-document (page borders/margins didn't break anchors).
- [ ] Download, print, fullscreen, zoom (desktop and the mobile menu), comparison select/swap/exit.
- [ ] Offline (DevTools): the indicator shows; a cached PDF opens; an uncached one shows the offline error; fonts still render; "download all" progress, cancel and complete.
- [ ] SW update: build twice and confirm `autoUpdate` swaps to the new shell and `dobpi-pdfs` survives.
- [ ] Splash: shows once per session, never blocks taps, the fail-safe hides it with JS disabled, reduced motion stops the animation.

**SEO**

- [ ] View source of `/` and of a `?pdf=` URL: every subject `<a href>` for **both** categories is present. Canonical/JSON-LD unchanged (`useSeo` tests pass). `sitemap.xml` unchanged.

**Accessibility**

- [ ] Keyboard only: tab order header → sidebar (search → tabs (arrow keys) → years → subjects → offline) → reader → pager. Focus ring visible on every control in both themes.
- [ ] Screen reader (VoiceOver/TalkBack): year buttons read the full label; current paper announced as current; saved papers read "បានទាញយក"; the toast and offline bar are announced.
- [ ] Every control ≥ 44px (DevTools inspect). Text contrast spot-checks with the DevTools picker.
- [ ] Lighthouse accessibility ≥ the Phase 1 baseline. Performance not worse by more than 5 points (fonts are the risk; see Phase 3 step 8).

---

## Phase 11: Ship

1. Open a PR from `feat/retro-ui` to `master` with before/after screenshots (Phase 1 vs now), the Lighthouse comparison, and a link to the design canvas.
2. Check the Netlify deploy preview on a real Android and iPhone: install as a PWA, go offline, reopen.
3. Merge, then watch for: font 404s (`/fonts/...` paths), layout reports on small Android phones (360px wide), and dark-mode contrast complaints.
4. **Rollback:** revert the merge commit. There are no data migrations. The only persisted keys touched are the removed `compactMode` (harmless if it comes back) and the unchanged `theme`, `dobpi_reading_position`, `bacii_docs_*` and `pwa-*`.

---

## Suggested PR breakdown (into `feat/retro-ui`)

1. **Foundation:** Phases 2, 3 and 7.1–7.3 (tokens, fonts, global CSS, theme colours). Visual change: fonts and background only.
2. **Logic:** Phase 4 (helpers, tabs state, `cachedPdfs`, removing compact mode) and its tests. No visual change.
3. **Shell:** 5.1–5.4, 5.11 (app, header, menu, sidebar frame, pager, page chip, scroll-top).
4. **Navigation:** 5.5–5.9 (tabs, ledger, search, offline card, footer blocks).
5. **Reader states:** 5.10, 5.12, 5.13 (container, loading/error, empty state, splash, toast, offline bar, install prompt).
6. **Comparison:** 5.14.
7. **Cleanup:** Phases 6, 7.4 (optional icons), 8, 9.

## Decisions for the owner before starting

1. **Body font:** switch to Battambang (as designed) or keep PengHuoth for body text and use the new fonts only for headings and numbers?
2. **PeaceBanner:** keep the flag colours (proposed) or restyle fully into the retro palette?
3. **App icons / OG image:** regenerate in the new palette (Phase 7.4) or leave them?
4. **Desktop dark mode for the drawer and states:** the canvas only designs dark for the mobile reader. This plan derives the rest from the tokens. Should those boards be designed first?
