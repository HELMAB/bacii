import { describe, expect, it, vi } from 'vitest'
import { getPdfScrollAnchor, getVisiblePdfPage, scrollToPdfAnchor } from '../../app/utils/pdfScroll'

const PAGE_HEIGHT = 500

// A scroll container 400px tall at the top of the viewport, holding stacked pages.
function createReader({ scrollTop = 0, pageCount = 3 } = {}) {
  const container = document.createElement('div')
  container.scrollTop = scrollTop

  vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({ top: 0, height: 400 })

  for (let index = 0; index < pageCount; index++) {
    const page = document.createElement('div')
    page.className = 'vue-pdf-embed__page'
    vi.spyOn(page, 'getBoundingClientRect').mockImplementation(() => {
      const top = index * PAGE_HEIGHT - container.scrollTop
      return { top, bottom: top + PAGE_HEIGHT, height: PAGE_HEIGHT }
    })
    container.appendChild(page)
  }

  return container
}

describe('getPdfScrollAnchor', () => {
  it('returns the page at the top of the viewport and the progress through it', () => {
    expect(getPdfScrollAnchor(createReader({ scrollTop: 750 }))).toEqual({ page: 1, offset: 0.5 })
  })

  it('returns null before any pages exist', () => {
    expect(getPdfScrollAnchor(createReader({ pageCount: 0 }))).toBeNull()
    expect(getPdfScrollAnchor(null)).toBeNull()
  })
})

describe('scrollToPdfAnchor', () => {
  it('moves to the anchored spot', () => {
    const container = createReader()
    scrollToPdfAnchor(container, { page: 2, offset: 0.25 })
    expect(container.scrollTop).toBe(1125)
  })

  it('round-trips with getPdfScrollAnchor', () => {
    const anchor = getPdfScrollAnchor(createReader({ scrollTop: 620 }))
    const container = createReader()
    scrollToPdfAnchor(container, anchor)
    expect(container.scrollTop).toBe(620)
  })

  it('ignores a page that no longer exists', () => {
    const container = createReader({ scrollTop: 40 })
    scrollToPdfAnchor(container, { page: 9, offset: 0 })
    expect(container.scrollTop).toBe(40)
  })
})

describe('getVisiblePdfPage', () => {
  it('counts the page crossing the middle of the viewport, from 1', () => {
    expect(getVisiblePdfPage(createReader())).toBe(1)
    expect(getVisiblePdfPage(createReader({ scrollTop: 400 }))).toBe(2)
  })

  it('stops at the last page', () => {
    expect(getVisiblePdfPage(createReader({ scrollTop: 5000 }))).toBe(3)
  })
})
