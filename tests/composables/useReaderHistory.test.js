import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref, shallowRef } from 'vue'
import { useReaderHistory } from '../../app/composables/useReaderHistory'
import { withSetup } from '../helpers/withSetup'

const POSITION_KEY = 'dobpi_reading_position'
const docs = [
  { pdf: '/a.pdf', label: 'Math', category: 'Science', year: '2021' },
  { pdf: '/b.pdf', label: 'Physics', category: 'Science', year: '2021' }
]

function setup({ overlayOpen = ref(false) } = {}) {
  const allPdfs = computed(() => docs)
  const selectedPdf = shallowRef(null)
  const selectPdf = vi.fn((doc) => {
    selectedPdf.value = doc.pdf
  })
  const close = vi.fn(() => {
    overlayOpen.value = false
  })

  const { result, unmount } = withSetup(() =>
    useReaderHistory({
      allPdfs,
      selectedPdf,
      selectPdf,
      overlays: [{ isOpen: overlayOpen, close, replacedByDoc: true }]
    })
  )

  const open = (doc) => selectPdf(doc, doc.category, doc.year)
  const openInitial = () => {
    const initial = result.resolveInitialDoc()
    result.openDocWithoutHistoryEntry(initial.doc, initial)
    return initial
  }

  return { ...result, selectedPdf, selectPdf, overlayOpen, close, open, openInitial, unmount }
}

function goBackTo(url, state = {}) {
  window.history.replaceState(state, '', url)
  window.dispatchEvent(new PopStateEvent('popstate', { state }))
}

describe('useReaderHistory', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
    vi.spyOn(window.history, 'back').mockImplementation(() => {})
  })

  describe('choosing the first document', () => {
    it('prefers the document in the URL', () => {
      window.history.replaceState({}, '', '/?pdf=%2Fb.pdf')
      localStorage.setItem(POSITION_KEY, JSON.stringify({ pdf: '/a.pdf', page: 2, offset: 0 }))

      expect(setup().resolveInitialDoc().doc.pdf).toBe('/b.pdf')
    })

    it('returns to the saved document and page', () => {
      localStorage.setItem(POSITION_KEY, JSON.stringify({ pdf: '/b.pdf', page: 2, offset: 0.5 }))

      const { doc, position, isDefaultDoc } = setup().resolveInitialDoc()

      expect(doc.pdf).toBe('/b.pdf')
      expect(position).toMatchObject({ page: 2, offset: 0.5 })
      expect(isDefaultDoc).toBe(false)
    })

    it('ignores a saved document that no longer exists', () => {
      localStorage.setItem(POSITION_KEY, JSON.stringify({ pdf: '/gone.pdf', page: 2, offset: 0 }))

      const { doc, position } = setup().resolveInitialDoc()

      expect(doc.pdf).toBe('/a.pdf')
      expect(position).toBeNull()
    })

    it('survives corrupt saved data', () => {
      localStorage.setItem(POSITION_KEY, '{not json')
      expect(setup().resolveInitialDoc().doc.pdf).toBe('/a.pdf')
    })
  })

  describe('keeping / as the homepage', () => {
    it('leaves the URL at / when the first exam opens by default', () => {
      const { openInitial, urlPdf, selectedPdf } = setup()

      openInitial()

      expect(selectedPdf.value).toBe('/a.pdf')
      expect(window.location.search).toBe('')
      expect(urlPdf.value).toBeNull()
    })

    it('adds the document to the URL when a saved one is restored', () => {
      localStorage.setItem(POSITION_KEY, JSON.stringify({ pdf: '/b.pdf', page: 0, offset: 0 }))
      const { openInitial, urlPdf } = setup()

      openInitial()

      expect(window.location.search).toBe('?pdf=%2Fb.pdf')
      expect(urlPdf.value).toBe('/b.pdf')
    })

    it('does not overwrite the saved position while opening it', () => {
      const saved = { pdf: '/b.pdf', page: 3, offset: 0.25 }
      localStorage.setItem(POSITION_KEY, JSON.stringify(saved))

      setup().openInitial()

      expect(JSON.parse(localStorage.getItem(POSITION_KEY))).toEqual(saved)
    })
  })

  describe('choosing a document', () => {
    it('adds a history entry with the document URL', () => {
      const pushState = vi.spyOn(window.history, 'pushState')
      const { open, urlPdf } = setup()

      open(docs[1])

      expect(pushState).toHaveBeenCalledOnce()
      expect(window.location.search).toBe('?pdf=%2Fb.pdf')
      expect(urlPdf.value).toBe('/b.pdf')
    })

    it('saves it as the place to return to', () => {
      setup().open(docs[1])

      expect(JSON.parse(localStorage.getItem(POSITION_KEY))).toEqual({
        pdf: '/b.pdf',
        page: 0,
        offset: 0
      })
    })
  })

  describe('the Back button', () => {
    it('reopens the previous document', () => {
      const { open, selectedPdf } = setup()
      open(docs[0])
      open(docs[1])

      goBackTo('/?pdf=%2Fa.pdf')

      expect(selectedPdf.value).toBe('/a.pdf')
    })

    it('shows the first exam again when returning to /', () => {
      const { open, selectedPdf, urlPdf } = setup()
      open(docs[1])

      goBackTo('/')

      expect(selectedPdf.value).toBe('/a.pdf')
      expect(urlPdf.value).toBeNull()
    })

    it('does not add a history entry for the move', () => {
      const { open } = setup()
      open(docs[0])
      open(docs[1])
      const pushState = vi.spyOn(window.history, 'pushState')

      goBackTo('/?pdf=%2Fa.pdf')

      expect(pushState).not.toHaveBeenCalled()
    })

    it('closes an open overlay instead of leaving the app', async () => {
      const overlayOpen = ref(false)
      const { close } = setup({ overlayOpen })
      overlayOpen.value = true

      goBackTo('/', { overlayDepth: 0 })

      expect(close).toHaveBeenCalledOnce()
      expect(overlayOpen.value).toBe(false)
      expect(window.history.back).not.toHaveBeenCalled()
    })
  })

  describe('overlays', () => {
    it('removes its history entry when closed normally', () => {
      const overlayOpen = ref(false)
      setup({ overlayOpen })

      overlayOpen.value = true
      overlayOpen.value = false

      expect(window.history.back).toHaveBeenCalledOnce()
    })

    it('lets a picked document take over the entry, leaving no dead one', () => {
      const overlayOpen = ref(false)
      const { open } = setup({ overlayOpen })
      overlayOpen.value = true
      const pushState = vi.spyOn(window.history, 'pushState')
      const replaceState = vi.spyOn(window.history, 'replaceState')

      open(docs[1])
      overlayOpen.value = false

      expect(pushState).not.toHaveBeenCalled()
      expect(replaceState).toHaveBeenCalledOnce()
      expect(window.history.back).not.toHaveBeenCalled()
    })
  })

  it('stops listening once unmounted', () => {
    const { open, unmount, selectPdf } = setup()
    open(docs[0])
    selectPdf.mockClear()
    unmount()

    goBackTo('/?pdf=%2Fb.pdf')

    expect(selectPdf).not.toHaveBeenCalled()
  })
})
