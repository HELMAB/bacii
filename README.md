# Bacii - ឯកសារប្រឡងបាក់ឌុប

![dobpi](./public/og-image.svg)

A modern, feature-rich PDF viewer application for Cambodian national exam papers (ឯកសារប្រឡងបាក់ឌុប). Built with Nuxt 3 and Vue 3, this application provides an intuitive interface for students to access, view, and study exam papers from 2014 to 2022. Available as both a web application and Android app.

🔗 **GitHub Repository**: [https://github.com/HELMAB/bacii](https://github.com/HELMAB/bacii)
🌐 **Live Demo**: [https://dobpi.netlify.app](https://dobpi.netlify.app)
📱 **Android App**: [Download APK](https://github.com/HELMAB/bacii/releases/download/1.0.1/bacii-app.apk)

## Features

### PDF Viewing
- Interactive PDF viewer with smooth rendering
- Zoom in/out controls (50% - 200%)
- Fullscreen mode
- Print and download functionality
- Page progress indicator
- Skeleton loading animations
- Internal link navigation support
- Scroll-to-top button

### PDF Comparison Mode
- Side-by-side PDF comparison
- Independent zoom controls for each PDF
- Swap PDFs functionality
- Modal selector for choosing comparison documents
- Synchronized viewing experience

### Navigation
- Organized by category, year, and subject
- Quick navigation between PDFs with arrow keys
- Recently viewed history (last 5 documents)
- Favorites system with localStorage persistence
- Search functionality across all subjects
- Breadcrumb navigation
- Current document position indicator

### Progressive Web App (PWA)
- Full offline support with Service Worker
- Install prompt for desktop and mobile
- Multiple caching strategies:
  - Cache-first for static assets
  - Network-first for runtime assets
  - Stale-while-revalidate for document data
  - Dedicated PDF cache for offline access
- Offline indicator showing connection status
- App shortcuts and share target API support
- PWA manifest with app icons (72x72 to 512x512)

### Performance & Caching
- **Data Caching**: 24-hour localStorage cache for docs.json with background refresh
- **Service Worker Caching**: 4 cache types with version-based invalidation
- **CDN Optimization**: Netlify caching headers for optimal delivery
  - PDFs cached for 1 year (immutable)
  - Fonts cached for 1 year (immutable)
  - Document data with stale-while-revalidate strategy
- Cache fallback to stale data when network fails

### User Interface
- Responsive design (mobile, tablet, desktop)
- Dark mode support with persistent preference
- Collapsible sidebar with compact mode
- Keyboard shortcuts for power users (14 shortcuts)
- Toast notifications for user feedback (3-second duration)
- Modal confirmation dialogs for destructive actions
- Smooth transitions and animations
- Custom scrollbar styling
- Empty state when no PDF selected

### Accessibility
- Khmer language support (km-KH)
- Custom PengHuoth font for authentic Khmer typography
- Keyboard navigation support
- ARIA-friendly modals
- Focus-visible styles
- Responsive touch controls for mobile devices

## Tech Stack

- **Framework**: Nuxt 4.2.1
- **Frontend**: Vue 3.5.24 with Composition API
- **Router**: Vue Router 4.6.3
- **Styling**: TailwindCSS 3.4.18
- **PDF Rendering**: vue-pdf-embed 2.1.3
- **Language**: TypeScript
- **PWA**: Custom Service Worker implementation
- **Deployment**: Netlify with advanced caching headers
- **Build Tools**: PostCSS 8.5.6, Autoprefixer 10.4.22

## State Management

The application uses Vue 3 Composition API with 13 custom composables for state management:

- `useComparison` - PDF comparison mode state
- `useDocsCache` - Document data caching with 24-hour expiry
- `useFavorites` - Favorites management with localStorage
- `useKeyboardShortcuts` - Global keyboard navigation
- `useNavigation` - PDF navigation and history
- `usePdfViewer` - PDF viewer state (zoom, page, fullscreen)
- `useRecentlyViewed` - Recently viewed tracking (max 5 items)
- `useResponsive` - Responsive breakpoints detection
- `useSearch` - Search functionality across documents
- `useSidebar` - Sidebar state and compact mode
- `useTheme` - Dark mode toggle with persistence
- `useToast` - Toast notification system

## Project Structure

```
bacii/
├── app/
│   ├── app.vue              # Main application component (443 lines)
│   ├── components/
│   │   ├── ConfirmModal.vue # Confirmation modal component
│   │   ├── InstallPrompt.vue # PWA install prompt
│   │   ├── KeyboardShortcutsModal.vue # Keyboard shortcuts help
│   │   ├── OfflineIndicator.vue # Connection status indicator
│   │   ├── ScrollToTopButton.vue # Scroll to top functionality
│   │   ├── ToastNotification.vue # Toast notification system
│   │   ├── PdfViewer/       # PDF viewer components
│   │   │   ├── ComparisonModal.vue # PDF comparison selector
│   │   │   ├── ComparisonView.vue  # Side-by-side comparison
│   │   │   └── PdfControls.vue     # Zoom, print, download controls
│   │   └── Sidebar/         # Sidebar components
│   │       ├── FavoritesSection.vue # Favorites list
│   │       ├── RecentSection.vue    # Recently viewed
│   │       ├── SearchBar.vue        # Search functionality
│   │       └── TreeView.vue         # Document tree navigation
│   ├── composables/         # Vue composables (13 files)
│   │   ├── useComparison.js
│   │   ├── useDocsCache.js
│   │   ├── useFavorites.js
│   │   ├── useKeyboardShortcuts.js
│   │   ├── useNavigation.js
│   │   ├── usePdfViewer.js
│   │   ├── useRecentlyViewed.js
│   │   ├── useResponsive.js
│   │   ├── useSearch.js
│   │   ├── useSidebar.js
│   │   ├── useTheme.js
│   │   └── useToast.js
│   ├── constants/
│   │   └── icons.js         # Subject icons and category gradients
│   ├── utils/
│   │   └── helpers.js       # Utility functions
│   └── assets/
│       └── css/
│           └── main.css     # Global styles and animations
├── public/
│   ├── pdfs/                # PDF files organized by category/year
│   │   ├── society/         # Social sciences exam papers (2014-2022)
│   │   └── science/         # Natural sciences exam papers (2014-2022)
│   ├── docs.json            # Exam papers metadata (788 lines)
│   ├── manifest.json        # PWA manifest with app icons
│   ├── sw.js                # Service Worker (228 lines, 4 cache types)
│   ├── fonts/PengHuoth/     # Khmer font files (Regular & Bold)
│   ├── sitemap.xml          # SEO sitemap
│   └── robots.txt           # Search engine directives
├── scripts/
│   └── generate-pwa-icons.js # PWA icon generator script
├── nuxt.config.ts           # Nuxt configuration
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
├── netlify.toml             # Netlify deployment config with caching
└── package.json             # Dependencies and scripts
```

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Keyboard Shortcuts

The application supports 14 keyboard shortcuts for power users:

| Key | Action |
|-----|--------|
| `/` | Focus search input |
| `←` | Previous PDF |
| `→` | Next PDF |
| `+` | Zoom in |
| `-` | Zoom out |
| `F` | Toggle fullscreen |
| `D` | Toggle dark mode |
| `C` | Toggle comparison mode |
| `S` | Toggle sidebar |
| `?` | Show keyboard shortcuts modal |
| `ESC` | Close sidebar/modal/search |
| `Home` | Go to first page |
| `End` | Go to last page |
| `P` | Print current PDF |

## Performance & Optimization

### Caching Strategy

The application implements a comprehensive multi-layer caching system:

#### Service Worker Caching
- **Version**: `dobpi-v2`
- **4 Cache Types**:
  - `STATIC_CACHE`: Cache-first for static assets (JS, CSS, images)
  - `PDF_CACHE`: Dedicated cache for PDF files
  - `DATA_CACHE`: Stale-while-revalidate for docs.json
  - `RUNTIME_CACHE`: Network-first for runtime assets
- **Version-based invalidation**: Old caches automatically cleared on updates
- **Offline fallback**: Serves cached content when network unavailable

#### LocalStorage Caching
- `docs.json` cached for 24 hours with timestamp versioning
- Background refresh for seamless updates
- Fallback to stale cache when network fails
- Cache keys:
  - `bacii_docs_data` - Document structure
  - `bacii_docs_version` - Cache timestamp
  - `favorites` - User favorites list
  - `recentlyViewed` - Recently viewed documents
  - `theme` - Dark mode preference
  - `compactMode` - Sidebar compact mode state

#### Netlify CDN Headers
- **PDFs**: 1 year cache (immutable)
- **Fonts**: 1 year cache (immutable, font-display: swap)
- **JS/CSS**: 1 year cache (immutable)
- **docs.json**: 1 hour max-age, 2 hours s-maxage, 1 day stale-while-revalidate
- **Security headers**: X-Frame-Options, X-Content-Type-Options

### Performance Features
- Lazy loading for PDF components
- Skeleton loading animations
- Optimized font loading with font-display: swap
- Responsive image handling
- Efficient Vue 3 reactivity system
- Minimal JavaScript bundle

## Available Exam Papers

### ថ្នាក់វិទ្យាសាស្ត្រសង្គម (Social Sciences)
**Years**: 2014(1), 2014(2), 2015-2022 (9 time periods)

**Subjects**:
- អក្សរសាស្ត្រខ្មែរ (Khmer Literature) 📚
- គណិតវិទ្យា (Mathematics) 🧮
- រូបវិទ្យា (Physics) ⚛️
- ជីវវិទ្យា (Biology) 🧬
- ប្រវត្តិសាស្ត្រ (History) 📜
- ភូមិវិទ្យា (Geography) 🌍
- ផែនដីវិទ្យា (Geology) ⛰️
- សីលធម៌-ពលរដ្ឋ (Morality-Citizenship) ❤️
- ភាសាអង់គ្លេស (English) 🇬🇧
- ភាសាបារាំង (French) 🇫🇷

### ថ្នាក់វិទ្យាសាស្ត្រពិត (Natural Sciences)
**Years**: 2014(1), 2014(2), 2015-2022 (9 time periods)

**Subjects**:
- អក្សរសាស្ត្រខ្មែរ (Khmer Literature) 📚
- គណិតវិទ្យា (Mathematics) 🧮
- រូបវិទ្យា (Physics) ⚛️
- គីមីវិទ្យា (Chemistry) 🧪
- ជីវវិទ្យា (Biology) 🧬
- ប្រវត្តិសាស្ត្រ (History) 📜
- ភាសាអង់គ្លេស (English) 🇬🇧
- ភាសាបារាំង (French) 🇫🇷

**Total**: 150+ exam papers across both categories

## Configuration

### Understanding docs.json Structure

The `public/docs.json` file (788 lines) contains the complete document tree structure:

```json
[
  {
    "label": "Category Name (e.g., វិទ្យាសាស្ត្រសង្គម)",
    "children": [
      {
        "label": "Year (e.g., ២០២២)",
        "children": [
          {
            "label": "Subject Name (e.g., អក្សរសាស្ត្រខ្មែរ)",
            "pdf": "/pdfs/society/2022/khmer-literature.pdf",
            "icon": "Subject icon emoji"
          }
        ]
      }
    ]
  }
]
```

### Adding New PDFs

**Step 1**: Place PDF files in the appropriate directory
```
public/pdfs/{category}/{year}/{subject}.pdf
```

**Step 2**: Update `public/docs.json` with the new entry
```json
{
  "label": "Subject Name in Khmer",
  "pdf": "/pdfs/category/year/subject.pdf",
  "icon": "Choose from subjectIcons"
}
```

**Step 3**: If adding a new subject, update `app/constants/icons.js`
```javascript
export const subjectIcons = {
  'អក្សរសាស្ត្រខ្មែរ': '📚',
  'គណិតវិទ្យា': '🧮',
  'Your New Subject': '🎯', // Choose appropriate emoji
  // ...
}
```

**Step 4**: (Optional) Update category gradients if adding new category
```javascript
export const categoryGradients = {
  'វិទ្យាសាស្ត្រសង្គម': 'from-blue-500 to-indigo-600',
  'Your New Category': 'from-purple-500 to-pink-600',
  // ...
}
```

### Theme Customization

Theme colors and gradients are defined in `app/constants/icons.js`:

```javascript
export const categoryGradients = {
  'វិទ្យាសាស្ត្រសង្គម': 'from-blue-500 to-indigo-600',
  'វិទ្យាសាស្ត្រធម្មជាតិ': 'from-green-500 to-teal-600',
  'គណិតវិទ្យា': 'from-purple-500 to-pink-600',
  'ប្រវត្តិសាស្ត្រ': 'from-amber-500 to-orange-600'
}
```

Subject icons (emojis) are also defined in the same file:

```javascript
export const subjectIcons = {
  'អក្សរសាស្ត្រខ្មែរ': '📚',
  'គណិតវិទ្យា': '🧮',
  // ...
}
```

## SEO & Meta Tags

The application includes comprehensive SEO optimization configured in `nuxt.config.ts`:

### Meta Tags
- **Title**: Bacii - ឯកសារប្រឡងបាក់ឌុប
- **Description**: Cambodian national exam papers viewer
- **Language**: Khmer (km-KH)
- **Theme Color**: #3B82F6 (blue)
- **Viewport**: Responsive, mobile-optimized

### Open Graph & Social Media
- Open Graph tags for Facebook/LinkedIn sharing
- Twitter Card support (summary_large_image)
- Custom OG image (`/og-image.svg`)
- Canonical URL: https://dobpi.netlify.app

### SEO Files
- **Sitemap**: `public/sitemap.xml` - Complete site structure
- **Robots**: `public/robots.txt` - Search engine directives
- **Manifest**: `public/manifest.json` - PWA configuration

### PWA Meta Tags
- Mobile web app capable
- Apple touch icons
- Standalone display mode
- Status bar styling

## Platform Support

### Web Application
- **Modern Browsers**:
  - Chrome/Edge (latest)
  - Firefox (latest)
  - Safari (latest)
- **Mobile Browsers**:
  - iOS Safari 12+
  - Chrome Mobile
  - Samsung Internet
- **Requirements**:
  - JavaScript enabled
  - Service Worker support (for offline features)
  - PDF rendering support

### Android Application
- **Version**: 1.0.1
- **Download**: [APK file](https://github.com/HELMAB/bacii/releases/download/1.0.1/bacii-app.apk)
- **Features**: Same as web version with native Android integration

### Progressive Web App
- Installable on desktop and mobile
- Works offline with cached content
- App-like experience
- Push notification ready (infrastructure in place)

## PWA Installation Guide

### Desktop (Chrome/Edge)
1. Visit https://dobpi.netlify.app
2. Click the install icon in the address bar (⊕ or computer icon)
3. Click "Install" in the prompt
4. App will open in a standalone window

### Mobile (Android)
1. Visit https://dobpi.netlify.app in Chrome/Firefox
2. Tap the menu (⋮) → "Install app" or "Add to Home Screen"
3. Confirm installation
4. App icon will appear on your home screen

Alternatively, download the native Android APK for full native integration.

### Mobile (iOS)
1. Visit https://dobpi.netlify.app in Safari
2. Tap the Share button (square with arrow)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add" to confirm

## Service Worker

The application uses a custom Service Worker (`public/sw.js`) with the following features:

### Cache Management
- **Version**: `dobpi-v2` (automatically invalidates old caches)
- **Strategies**:
  - Static assets: Cache-first (instant loading)
  - PDFs: Dedicated cache for offline access
  - Document data: Stale-while-revalidate (fresh data with instant response)
  - Runtime: Network-first with cache fallback

### Cache Clearing
The Service Worker automatically clears old caches when a new version is activated. To manually clear caches:
1. Open DevTools → Application → Storage
2. Click "Clear site data"
3. Refresh the page

### Development
During development, the Service Worker is registered but can be disabled via DevTools:
1. DevTools → Application → Service Workers
2. Check "Update on reload" and "Bypass for network"

## Deployment

### Production Deployment
The application is deployed at: **https://dobpi.netlify.app**

### Netlify Configuration
The project includes a `netlify.toml` file with optimized settings:

#### Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `.output/public`
- **Node version**: Automatic

#### Cache Headers
- **Static assets** (JS/CSS/images): 1 year immutable
- **PDFs**: 1 year immutable with public caching
- **Fonts**: 1 year immutable
- **docs.json**: Advanced stale-while-revalidate strategy
  - max-age: 1 hour
  - s-maxage: 2 hours
  - stale-while-revalidate: 1 day

#### Security Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`

### Deploy to Other Platforms

For deployment to other platforms:
1. Build the application: `npm run build`
2. Deploy the `.output/public` directory
3. Configure similar caching headers for optimal performance
4. Ensure Service Worker is served with proper MIME type

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for platform-specific guides.

## Troubleshooting & Development Tips

### Common Issues

#### PDFs Not Loading
- **Check browser console** for errors
- **Clear Service Worker cache**: DevTools → Application → Storage → Clear site data
- **Verify PDF path** in docs.json matches actual file location
- **Check file permissions** if running locally

#### Service Worker Not Updating
1. Open DevTools → Application → Service Workers
2. Click "Unregister" on the current service worker
3. Hard refresh the page (Ctrl/Cmd + Shift + R)
4. The new service worker will be registered

#### Dark Mode Not Persisting
- Check localStorage is enabled in your browser
- Verify `theme` key exists in localStorage
- Clear localStorage and toggle dark mode again

#### Recently Viewed/Favorites Not Saving
- Check localStorage quota (usually 5-10MB)
- Verify localStorage is not disabled
- Check browser's privacy settings

### Development Tips

#### Hot Module Replacement
The development server supports HMR. Changes to Vue components, composables, and CSS will reflect immediately without full page reload.

#### Debugging Composables
Use Vue DevTools to inspect composable state:
1. Install Vue DevTools browser extension
2. Open DevTools → Vue tab
3. Inspect component state and composables

#### Testing Service Worker
To test Service Worker in development:
1. Build the production version: `npm run build`
2. Preview locally: `npm run preview`
3. Open DevTools → Application → Service Workers

#### PWA Icon Generation
To regenerate PWA icons:
```bash
node scripts/generate-pwa-icons.js
```

#### LocalStorage Inspection
View all app data in localStorage:
```javascript
// In browser console
Object.keys(localStorage).filter(key =>
  key.startsWith('bacii') ||
  ['favorites', 'recentlyViewed', 'theme', 'compactMode'].includes(key)
).forEach(key => console.log(key, localStorage.getItem(key)))
```

#### Performance Profiling
1. DevTools → Performance tab
2. Start recording
3. Navigate through the app
4. Stop recording and analyze
5. Look for long tasks and optimize accordingly

### Environment Variables
No environment variables are currently used. All configuration is in:
- `nuxt.config.ts` - Nuxt configuration
- `tailwind.config.js` - Styling configuration
- `netlify.toml` - Deployment configuration

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue on [GitHub](https://github.com/HELMAB/bacii/issues).

---

<div align="center">

**Bacii - ឯកសារប្រឡងបាក់ឌុប**

Copyright © 2025 [Dobpi](https://github.com/HELMAB/bacii)

Made with ❤️ for Cambodian students

[GitHub](https://github.com/HELMAB/bacii) • [Live Demo](https://dobpi.netlify.app) • [Report Bug](https://github.com/HELMAB/bacii/issues) • [Request Feature](https://github.com/HELMAB/bacii/issues)

</div>
