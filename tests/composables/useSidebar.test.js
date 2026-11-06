import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { useSidebar } from '../../app/composables/useSidebar'
import { withSetup } from '../helpers/withSetup'

const SOCIAL = 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម'
const SCIENCE = 'ថ្នាក់វិទ្យាសាស្ត្រពិត'

function setup() {
  return withSetup(() => useSidebar(shallowRef(true))).result
}

describe('useSidebar', () => {
  it('activates only the selected category', () => {
    const sidebar = setup()

    sidebar.selectCategory(SOCIAL)
    sidebar.selectCategory(SCIENCE)

    expect(sidebar.activeCategory.value).toBe(SCIENCE)
    expect(sidebar.expandedCategories[SCIENCE]).toBe(true)
    expect(sidebar.expandedCategories[SOCIAL]).toBe(false)
  })

  it('keeps the open year when switching category', () => {
    const sidebar = setup()
    sidebar.toggleYear('វិញ្ញាសាប្រឡងឆ្នាំ២០២២')

    sidebar.selectCategory(SCIENCE)

    expect(sidebar.expandedYears['វិញ្ញាសាប្រឡងឆ្នាំ២០២២']).toBe(true)
  })

  it('opens one year at a time', () => {
    const sidebar = setup()

    sidebar.toggleYear('a')
    sidebar.toggleYear('b')

    expect(sidebar.expandedYears).toEqual({ a: false, b: true })
  })

  it('defaults to the first category', () => {
    const sidebar = setup()

    sidebar.ensureActiveCategory([{ label: SOCIAL }, { label: SCIENCE }])

    expect(sidebar.activeCategory.value).toBe(SOCIAL)
  })

  it('keeps an existing choice when a default is offered', () => {
    const sidebar = setup()
    sidebar.selectCategory(SCIENCE)

    sidebar.ensureActiveCategory([{ label: SOCIAL }, { label: SCIENCE }])

    expect(sidebar.activeCategory.value).toBe(SCIENCE)
  })

  it('forgets the removed compact mode setting', () => {
    localStorage.setItem('compactMode', 'true')

    setup()

    expect(localStorage.getItem('compactMode')).toBeNull()
  })
})
