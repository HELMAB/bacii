# Changelog

All notable changes to **Bacii (Dobpi)** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] — 2026-06-08

### Added

- Minimal, flat redesign of the entire interface (sharp edges, clean typography) with a subtle dot-grid background on the reading surface.
- Lucide icons for every subject, replacing the previous emoji set.
- Ownership & credit notice in the sidebar, clarifying that all documents belong to their original owners and the site exists only to help Cambodian students.
- Theme is applied before first paint, removing the light-mode flash when opening in dark mode.
- ESLint + Prettier tooling with `lint`, `lint:fix`, `format`, and `format:check` scripts.

### Changed

- Full-screen, edge-to-edge PDF reader with a slim top bar and floating page controls.
- Navigation moved into a sidebar that splits the view on desktop (open by default) and slides over as a drawer on mobile.
- Peace banner and footer now live inside the sidebar to keep the reading area uncluttered.
- PDF pages render at a proper reading width and re-render crisply when zooming.
- Side-by-side comparison view uses consistent page sizing.
- README rewritten to focus on what the site does for students.

### Fixed

- PDF page is now centered instead of leaving large empty space on the right.
- Fixed pages rendering too small after the layout change.
- Actions menu no longer hides behind the document.
- Floating page controls and progress indicator now stay centered over the reader.

## [1.0.1] — 2025-11-29

### Added

- Native Android app (APK) alongside the web version.

### Changed

- `docs.json` caching with stale-while-revalidate and offline fallback.

## [1.0.0] — 2025-11-22

### Added

- Initial release: viewer for Cambodian national exam papers (បាក់ឌុប).
- Browse papers by category, year, and subject.
- PDF reading with zoom, fullscreen, download, and print.
- Search across all subjects.
- Side-by-side comparison of two papers.
- Light and dark mode.
- Progressive Web App with offline support.
- Full Khmer language interface.

[Unreleased]: https://github.com/HELMAB/bacii/compare/1.0.2...HEAD
[1.0.2]: https://github.com/HELMAB/bacii/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/HELMAB/bacii/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/HELMAB/bacii/releases/tag/1.0.0
