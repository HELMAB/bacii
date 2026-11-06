// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', '@vite-pwa/nuxt'],

  eslint: {
    config: {
      stylistic: false
    }
  },

  pwa: {
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.js',
    registerType: 'autoUpdate',
    // public/manifest.json is hand-maintained and linked in app.head below.
    manifest: false,
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,svg,ico,woff,woff2,wasm}'],
      // PDFs are cached on demand (see service-worker/sw.js), never precached.
      globIgnores: ['pdfs/**'],
      // The pdf.js worker chunk is larger than the 2 MB Workbox default.
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/sitemap.xml': { prerender: true }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'km'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'keywords',
          content:
            'ប្រឡងបាក់ឌុប, វិទ្យាសាស្ត្រសង្គម, ឯកសារប្រឡង, គណិតវិទ្យា, រូបវិទ្យា, គីមីវិទ្យា, ជីវវិទ្យា, អក្សរសាស្ត្រខ្មែរ, ប្រវត្តិសាស្ត្រ, ភូមិវិទ្យា, សីលធម៌, ភាសាអង់គ្លេស'
        },
        { name: 'author', content: 'Dobpi' },
        { name: 'theme-color', content: '#2A1D14' },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Dobpi' },
        { property: 'og:image', content: 'https://dobpi.netlify.app/og-image.png' },
        { property: 'og:image:alt', content: 'Dobpi: ឯកសារប្រឡងបាក់ឌុប ២០១៤ ដល់ ២០២២' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'km_KH' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://dobpi.netlify.app/og-image.png' },

        // Additional SEO
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Dobpi' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
        // Both weights are on first paint (body text and headings), Khmer subsets.
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/GoogleSans/GoogleSans-400-khmer.woff2',
          crossorigin: ''
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/GoogleSans/GoogleSans-700-khmer.woff2',
          crossorigin: ''
        }
      ],
      script: [
        {
          // Before first paint: apply the saved theme to avoid a light-mode flash (FOUC),
          // and skip the splash screen if this session has already seen it.
          innerHTML: `
            (function () {
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                }
                if (sessionStorage.getItem('dobpi_splash_seen') === '1') {
                  document.documentElement.classList.add('splash-seen');
                }
              } catch (e) {}
            })();
          `,
          type: 'text/javascript',
          tagPosition: 'head'
        }
      ]
    }
  }
})
