import { describe, expect, it } from 'vitest'
import { extractYear } from '../../app/utils/helpers'

describe('extractYear', () => {
  it('finds a four-digit year', () => {
    expect(extractYear('Exam 2019')).toBe('2019')
  })

  it('returns an empty string when there is no year', () => {
    expect(extractYear('Exam')).toBe('')
  })
})
