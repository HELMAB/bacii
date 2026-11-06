import { describe, expect, it } from 'vitest'
import { nextTick, reactive, shallowRef } from 'vue'
import { useSearch } from '../../app/composables/useSearch'

const data = shallowRef([
  {
    label: 'Science',
    children: [
      { label: '2021', children: [{ label: 'Math' }, { label: 'Physics' }] },
      { label: '2022', children: [{ label: 'Physics' }] }
    ]
  }
])

function setup() {
  const expandedCategories = reactive({})
  const expandedYears = reactive({})
  return {
    ...useSearch(data, expandedCategories, expandedYears),
    expandedCategories,
    expandedYears
  }
}

describe('useSearch', () => {
  it('returns everything without a query', () => {
    expect(setup().filteredData.value).toBe(data.value)
  })

  it('keeps only matching subjects and drops empty years', () => {
    const { searchQuery, filteredData } = setup()
    searchQuery.value = 'math'

    expect(filteredData.value[0].children).toEqual([
      { label: '2021', children: [{ label: 'Math' }] }
    ])
  })

  it('returns nothing when no subject matches', () => {
    const { searchQuery, filteredData } = setup()
    searchQuery.value = 'zzz'
    expect(filteredData.value).toEqual([])
  })

  it('expands the results so they are visible', async () => {
    const { searchQuery, expandedCategories, expandedYears } = setup()
    searchQuery.value = 'math'
    await nextTick()

    expect(expandedCategories.Science).toBe(true)
    expect(expandedYears['2021']).toBe(true)
  })
})
