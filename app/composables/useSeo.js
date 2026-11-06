import { computed } from 'vue'
import { setResponseStatus, useHead, useRequestEvent, useRequestURL, useSeoMeta } from '#imports'
import { SITE_NAME, SITE_URL } from '../constants/site'
import { getDocPath } from '../utils/docUrl'

const HOME_TITLE = `ឯកសារប្រឡងបាក់ឌុប ២០១៤–២០២២ ឥតគិតថ្លៃ — ${SITE_NAME}`
const HOME_HEADING = 'ឯកសារប្រឡងបាក់ឌុប'
const HOME_DESCRIPTION =
  'មើលនិងទាញយកឯកសារប្រឡងបាក់ឌុបឆ្នាំ២០១៤ ដល់ ២០២២ សម្រាប់ថ្នាក់វិទ្យាសាស្ត្រសង្គម និងវិទ្យាសាស្ត្រពិត គ្រប់មុខវិជ្ជា ដោយឥតគិតថ្លៃ។ អានបានលើទូរសព្ទ និងក្រៅបណ្តាញ។'

function describeDoc(doc) {
  return `${doc.label} ${doc.year} ${doc.category}`
}

function buildStructuredData(doc, url, description) {
  const website = {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: 'km'
  }

  if (!doc) {
    return { '@context': 'https://schema.org', ...website, description }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: describeDoc(doc),
    description,
    url,
    inLanguage: 'km',
    isAccessibleForFree: true,
    learningResourceType: 'Exam paper',
    educationalLevel: 'Grade 12',
    isPartOf: website,
    encoding: {
      '@type': 'MediaObject',
      contentUrl: `${SITE_URL}${doc.pdf}`,
      encodingFormat: 'application/pdf'
    }
  }
}

// Page metadata, driven by the URL rather than the open document: `/` shows the
// first exam without being that exam, and must stay indexed as the homepage.
export function useSeo({ allPdfs, urlPdf }) {
  const { pathname } = useRequestURL()
  const isKnownPath = pathname === '/'

  // Everything is served by the same shell, so unknown paths need an explicit 404.
  if (import.meta.server && !isKnownPath) {
    setResponseStatus(useRequestEvent(), 404)
  }

  const doc = computed(() => allPdfs.value.find(({ pdf }) => pdf === urlPdf.value))

  const title = computed(() =>
    doc.value ? `${describeDoc(doc.value)} — ${SITE_NAME}` : HOME_TITLE
  )
  const description = computed(() =>
    doc.value
      ? `មើលនិងទាញយកឯកសារប្រឡងបាក់ឌុប ${describeDoc(doc.value)} ដោយឥតគិតថ្លៃ។ អានបានលើទូរសព្ទ និងក្រៅបណ្តាញ។`
      : HOME_DESCRIPTION
  )
  const canonicalUrl = computed(() =>
    doc.value ? `${SITE_URL}${getDocPath(doc.value.pdf)}` : `${SITE_URL}/`
  )
  const pageHeading = computed(() => (doc.value ? describeDoc(doc.value) : HOME_HEADING))

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonicalUrl,
    twitterTitle: title,
    twitterDescription: description,
    robots: isKnownPath ? 'index, follow, max-image-preview:large' : 'noindex'
  })

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: [
      {
        key: 'structured-data',
        type: 'application/ld+json',
        // `<` would let a label close the script tag early.
        innerHTML: computed(() =>
          JSON.stringify(
            buildStructuredData(doc.value, canonicalUrl.value, description.value)
          ).replace(/</g, '\\u003c')
        )
      }
    ]
  })

  return { pageHeading }
}
