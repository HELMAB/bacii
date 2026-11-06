import { describe, expect, it, vi } from 'vitest'
import { ref, shallowRef } from 'vue'
import { useNavigation } from '../../app/composables/useNavigation'

const data = shallowRef([
  {
    label: 'Science',
    children: [
      {
        label: '2021',
        children: [
          { label: 'Math', pdf: '/a.pdf' },
          { label: 'Physics', pdf: '/b.pdf' }
        ]
      },
      { label: '2022', children: [{ label: 'Math', pdf: '/c.pdf' }] }
    ]
  }
])

function setup(selected) {
  const selectPdf = vi.fn()
  const nav = useNavigation(data, ref(selected), selectPdf, vi.fn())
  return { ...nav, selectPdf }
}

describe('useNavigation', () => {
  it('flattens the tree in docs.json order', () => {
    expect(setup('/a.pdf').allPdfs.value.map(({ pdf }) => pdf)).toEqual([
      '/a.pdf',
      '/b.pdf',
      '/c.pdf'
    ])
  })

  it('moves across year boundaries', () => {
    const { goToNextPdf, selectPdf } = setup('/b.pdf')
    goToNextPdf()
    expect(selectPdf).toHaveBeenCalledWith(
      expect.objectContaining({ pdf: '/c.pdf' }),
      'Science',
      '2022'
    )
  })

  it('stops at both ends of the list', () => {
    const first = setup('/a.pdf')
    first.goToPreviousPdf()
    expect(first.canGoPrevious.value).toBe(false)
    expect(first.selectPdf).not.toHaveBeenCalled()

    const last = setup('/c.pdf')
    last.goToNextPdf()
    expect(last.canGoNext.value).toBe(false)
    expect(last.selectPdf).not.toHaveBeenCalled()
  })
})
