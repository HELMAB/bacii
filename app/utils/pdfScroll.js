const PAGE_SELECTOR = '.vue-pdf-embed__page'

function getPages(container) {
  return [...container.querySelectorAll(PAGE_SELECTOR)]
}

// Where the reader is: the page at the top of the viewport and how far through it.
export function getPdfScrollAnchor(container) {
  if (!container) return null

  const containerTop = container.getBoundingClientRect().top
  const pages = getPages(container)
  const page = pages.findIndex((el) => el.getBoundingClientRect().bottom > containerTop)
  if (page === -1) return null

  const { top, height } = pages[page].getBoundingClientRect()
  return { page, offset: height > 0 ? Math.max((containerTop - top) / height, 0) : 0 }
}

export function scrollToPdfAnchor(container, anchor) {
  const page = container && anchor ? getPages(container)[anchor.page] : null
  if (!page) return

  const { top, height } = page.getBoundingClientRect()
  container.scrollTop += top - container.getBoundingClientRect().top + anchor.offset * height
}

// 1-based number of the page crossing the middle of the viewport.
export function getVisiblePdfPage(container) {
  const { top, height } = container.getBoundingClientRect()
  const middle = top + height / 2
  const pages = getPages(container)
  const index = pages.findIndex((el) => el.getBoundingClientRect().bottom > middle)
  return index === -1 ? pages.length : index + 1
}
