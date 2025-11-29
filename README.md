# Bacii - ឯកសារប្រឡងបាក់ឌុប

![dobpi](./public/og-image.svg)

A modern, feature-rich PDF viewer application for Cambodian national exam papers (ឯកសារប្រឡងបាក់ឌុប). Built with Nuxt 3 and Vue 3, this application provides an intuitive interface for students to access, view, and study exam papers from 2014 to 2022.

🔗 **GitHub Repository**: [https://github.com/HELMAB/bacii](https://github.com/HELMAB/bacii)
🌐 **Live Demo**: [https://dobpi.netlify.app](https://dobpi.netlify.app)

## Features

### PDF Viewing
- Interactive PDF viewer with smooth rendering
- Zoom in/out controls (50% - 200%)
- Fullscreen mode
- Print and download functionality
- Page progress indicator
- Skeleton loading animations

### Navigation
- Organized by category, year, and subject
- Quick navigation between PDFs with arrow keys
- Recently viewed history (last 5 documents)
- Search functionality across all subjects
- Breadcrumb navigation

### User Interface
- Responsive design (mobile, tablet, desktop)
- Dark mode support with persistent preference
- Collapsible sidebar with compact mode
- Keyboard shortcuts for power users
- Toast notifications for user feedback
- Modal confirmation dialogs for destructive actions
- Smooth transitions and animations

### Accessibility
- Khmer language support (km-KH)
- Custom PengHuoth font for authentic Khmer typography
- Keyboard navigation support
- Responsive touch controls for mobile devices

## Tech Stack

- **Framework**: Nuxt 4.2.1
- **Frontend**: Vue 3.5.24 with Composition API
- **Styling**: TailwindCSS 3.4.18
- **PDF Rendering**: vue-pdf-embed 2.1.3
- **Language**: TypeScript

## Project Structure

```
bacii/
├── app/
│   ├── app.vue              # Main application component
│   ├── components/
│   │   ├── ConfirmModal.vue # Confirmation modal component
│   │   ├── KeyboardShortcutsModal.vue
│   │   ├── ScrollToTopButton.vue
│   │   ├── ToastNotification.vue
│   │   ├── PdfViewer/       # PDF viewer components
│   │   └── Sidebar/         # Sidebar components
│   ├── composables/         # Vue composables for state management
│   ├── constants/
│   │   └── icons.js         # Subject icons and category gradients
│   ├── utils/
│   │   └── helpers.js       # Utility functions
│   └── assets/
│       └── css/
│           └── main.css     # Global styles
├── public/
│   ├── pdfs/                # PDF files organized by category/year
│   │   ├── society/         # Social sciences exam papers
│   │   └── science/         # Natural sciences exam papers
│   ├── docs.json            # Exam papers data structure
│   ├── fonts/               # PengHuoth font files
│   ├── sitemap.xml          # SEO sitemap
│   └── robots.txt           # Robots file for search engines
├── nuxt.config.ts           # Nuxt configuration
├── tailwind.config.js       # TailwindCSS configuration
└── package.json             # Dependencies
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

| Key | Action |
|-----|--------|
| `/` | Focus search input |
| `←` | Previous PDF |
| `→` | Next PDF |
| `+` | Zoom in |
| `-` | Zoom out |
| `F` | Toggle fullscreen |
| `?` | Show keyboard shortcuts |
| `ESC` | Close sidebar/modal/search |

## Available Exam Papers

### ថ្នាក់វិទ្យាសាស្ត្រសង្គម (Social Sciences)
Years: 2014 - 2022

Subjects:
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
Years: 2014 - 2022

Subjects:
- អក្សរសាស្ត្រខ្មែរ (Khmer Literature) 📚
- គណិតវិទ្យា (Mathematics) 🧮
- រូបវិទ្យា (Physics) ⚛️
- គីមីវិទ្យា (Chemistry) 🧪
- ជីវវិទ្យា (Biology) 🧬
- ប្រវត្តិសាស្ត្រ (History) 📜
- ភាសាអង់គ្លេស (English) 🇬🇧
- ភាសាបារាំង (French) 🇫🇷

## Configuration

### Adding New PDFs

1. Place PDF files in `public/pdfs/{category}/{year}/{subject}.pdf`
2. Update `public/docs.json` with the new entries:

```json
{
  "label": "Category Name",
  "children": [
    {
      "label": "Year",
      "children": [
        {
          "label": "Subject Name",
          "pdf": "/pdfs/category/year/subject.pdf",
          "icon": "icon-name"
        }
      ]
    }
  ]
}
```

3. If adding a new subject, update `app/constants/icons.js` to add the emoji icon:

```javascript
export const subjectIcons = {
  'Subject Name in Khmer': '📚', // Choose appropriate emoji
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

The application includes comprehensive SEO optimization:
- XML sitemap (`public/sitemap.xml`)
- Robots.txt file (`public/robots.txt`)
- Open Graph meta tags for social media sharing
- Twitter Card support
- Canonical URL: https://dobpi.netlify.app
- Khmer locale (km-KH)
- Mobile web app capabilities

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled

## Deployment

The application is deployed at: **https://dobpi.netlify.app**

For deployment to other platforms, check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for platform-specific deployment guides.

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
