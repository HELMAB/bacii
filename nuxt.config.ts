// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'km'
      },
      title: 'Home — Dobpi',
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'ឯកសារប្រឡងបាក់ឌុបសម្រាប់វិទ្យាសាស្ត្រសង្គម - ឆ្នាំ២០១៤ ដល់ ២០២២. មើលនិងទាញយកឯកសារប្រឡងគ្រប់មុខវិជ្ជាទាំងអស់ដោយឥតគិតថ្លៃ។' },
        { name: 'keywords', content: 'ប្រឡងបាក់ឌុប, វិទ្យាសាស្ត្រសង្គម, ឯកសារប្រឡង, គណិតវិទ្យា, រូបវិទ្យា, គីមីវិទ្យា, ជីវវិទ្យា, អក្សរសាស្ត្រខ្មែរ, ប្រវត្តិសាស្ត្រ, ភូមិវិទ្យា, សីលធម៌, ភាសាអង់គ្លេស' },
        { name: 'author', content: 'Dobpi' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#3B82F6' },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Dobpi' },
        { property: 'og:title', content: 'Dobpi - ឯកសារប្រឡងបាក់ឌុប' },
        { property: 'og:description', content: 'ឯកសារប្រឡងបាក់ឌុបសម្រាប់វិទ្យាសាស្ត្រសង្គម - ឆ្នាំ២០១៤ ដល់ ២០២២. មើលនិងទាញយកឯកសារប្រឡងគ្រប់មុខវិជ្ជាទាំងអស់ដោយឥតគិតថ្លៃ។' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:image:alt', content: 'Dobpi - ឯកសារប្រឡងបាក់ឌុប' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'km_KH' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Dobpi - ឯកសារប្រឡងបាក់ឌុប' },
        { name: 'twitter:description', content: 'ឯកសារប្រឡងបាក់ឌុបសម្រាប់វិទ្យាសាស្ត្រសង្គម - ឆ្នាំ២០១៤ ដល់ ២០២៥. មើលនិងទាញយកឯកសារប្រឡងគ្រប់មុខវិជ្ជាទាំងអស់ដោយឥតគិតថ្លៃ។' },
        { name: 'twitter:image', content: '/og-image.png' },

        // Additional SEO
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Dobpi' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://dobpi.netlify.app' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  }
})
