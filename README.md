# Bacii - ឯកសារប្រឡងបាក់ឌុប

![dobpi](./public/og-image.svg)

A modern, feature-rich PDF viewer application for Cambodian national exam papers (ឯកសារប្រឡងបាក់ឌុប). Built with Nuxt 3 and Vue 3, this application provides an intuitive interface for students to access, view, and study exam papers from 2014 to 2022.

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
│   │   ├── ToastNotification.vue
│   │   ├── PdfViewer/       # PDF viewer components
│   │   └── Sidebar/         # Sidebar components
│   ├── composables/         # Vue composables for state management
│   ├── data/
│   │   └── docs.json        # Exam papers data structure
│   └── assets/
│       └── css/
│           └── main.css     # Global styles
├── public/
│   ├── pdfs/                # PDF files organized by category/year
│   └── fonts/               # PengHuoth font files
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

### វិទ្យាសាស្ត្រសង្គម (Social Sciences)
Years: 2014 - 2022

Subjects:
- អក្សរសាស្ត្រខ្មែរ (Khmer Literature)
- គណិតវិទ្យា (Mathematics)
- រូបវិទ្យា (Physics)
- គីមីវិទ្យា (Chemistry)
- ជីវវិទ្យា (Biology)
- ប្រវត្តិសាស្ត្រ (History)
- ភូមិវិទ្យា (Geography)
- សីលធម៌ (Morality)
- ភាសាអង់គ្លេស (English)

## Configuration

### Adding New PDFs

1. Place PDF files in `public/pdfs/{category}/{year}/{subject}.pdf`
2. Update `app/data/docs.json` with the new entries:

```json
{
  "label": "Category Name",
  "children": [
    {
      "label": "Year",
      "children": [
        {
          "label": "Subject Name",
          "pdf": "/pdfs/category/year/subject.pdf"
        }
      ]
    }
  ]
}
```

### Theme Customization

Theme colors and gradients are defined in `app/app.vue`:

```javascript
const categoryGradients = {
  'វិទ្យាសាស្ត្រសង្គម': 'from-blue-500 to-indigo-600',
  'វិទ្យាសាស្ត្រធម្មជាតិ': 'from-green-500 to-teal-600',
  // Add more categories...
}
```

## SEO & Meta Tags

The application includes comprehensive SEO optimization:
- Open Graph meta tags for social media sharing
- Twitter Card support
- Proper canonical URLs
- Khmer locale (km-KH)
- Mobile web app capabilities

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled

## Deployment

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for platform-specific deployment guides.

## License

Private project

## Contributing

This is a private educational project. For issues or suggestions, please contact the project maintainer.
