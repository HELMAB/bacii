import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, shallowRef, toValue } from 'vue'
import { setResponseStatus, useHead, useRequestURL, useSeoMeta } from '#imports'
import { useSeo } from '../../app/composables/useSeo'

const SITE = 'https://dobpi.netlify.app'
const docs = [
  { pdf: '/a.pdf', label: 'Math', year: '2021', category: 'Science' },
  { pdf: '/b.pdf', label: 'Math', year: '2022', category: 'Science' }
]

function setup(pdf = null, path = '/') {
  useRequestURL.mockReturnValue(new URL(path, SITE))
  const urlPdf = shallowRef(pdf)
  const { pageHeading } = useSeo({ allPdfs: computed(() => docs), urlPdf })

  const meta = useSeoMeta.mock.lastCall[0]
  const head = useHead.mock.lastCall[0]
  return {
    urlPdf,
    pageHeading,
    title: () => toValue(meta.title),
    description: () => toValue(meta.description),
    ogUrl: () => toValue(meta.ogUrl),
    robots: () => meta.robots,
    canonical: () => toValue(head.link[0].href),
    structuredData: () => JSON.parse(toValue(head.script[0].innerHTML))
  }
}

describe('useSeo', () => {
  beforeEach(() => vi.clearAllMocks())

  it('describes the homepage when the URL names no document', () => {
    const seo = setup()

    expect(seo.title()).toContain('Dobpi')
    expect(seo.canonical()).toBe(`${SITE}/`)
    expect(seo.structuredData()['@type']).toBe('WebSite')
  })

  it('gives each document its own title and canonical URL', () => {
    const first = setup('/a.pdf')
    const second = setup('/b.pdf')

    expect(first.title()).not.toBe(second.title())
    expect(first.description()).not.toBe(second.description())
    expect(first.canonical()).toBe(`${SITE}/?pdf=%2Fa.pdf`)
    expect(first.ogUrl()).toBe(first.canonical())
  })

  it('describes a document as a learning resource with its PDF', () => {
    const data = setup('/a.pdf').structuredData()

    expect(data['@type']).toBe('LearningResource')
    expect(data.isAccessibleForFree).toBe(true)
    expect(data.encoding.contentUrl).toBe(`${SITE}/a.pdf`)
  })

  it('follows the URL as it changes', () => {
    const seo = setup('/a.pdf')
    seo.urlPdf.value = null
    expect(seo.canonical()).toBe(`${SITE}/`)
  })

  it('treats an unknown document as the homepage', () => {
    const seo = setup('/gone.pdf')

    expect(seo.canonical()).toBe(`${SITE}/`)
    expect(seo.pageHeading.value).toBe('ឯកសារប្រឡងបាក់ឌុប')
  })

  it('stops labels from closing the JSON-LD script tag', () => {
    const allPdfs = computed(() => [{ ...docs[0], label: '</script>' }])
    useRequestURL.mockReturnValue(new URL('/', SITE))
    useSeo({ allPdfs, urlPdf: shallowRef('/a.pdf') })

    expect(toValue(useHead.mock.lastCall[0].script[0].innerHTML)).not.toContain('</script>')
  })

  it('indexes known pages', () => {
    expect(setup().robots()).toContain('index, follow')
  })

  it('hides unknown paths from search engines', () => {
    expect(setup(null, '/does-not-exist').robots()).toBe('noindex')
    expect(setup(null, '/').robots()).not.toBe('noindex')
  })

  it('does not set a status code in the browser', () => {
    setup(null, '/does-not-exist')
    expect(setResponseStatus).not.toHaveBeenCalled()
  })
})
