import { describe, expect, it } from 'vitest'
import {
  formatSubjectCount,
  formatYearShort,
  parseYearLabel,
  stripCategoryPrefix,
  toKhmerDigits
} from '../../app/utils/khmer'

describe('toKhmerDigits', () => {
  it('converts numbers and digit strings', () => {
    expect(toKhmerDigits(2022)).toBe('២០២២')
    expect(toKhmerDigits('2022')).toBe('២០២២')
  })

  it('leaves everything else untouched', () => {
    expect(toKhmerDigits('100%')).toBe('១០០%')
    expect(toKhmerDigits('133 / 138')).toBe('១៣៣ / ១៣៨')
    expect(toKhmerDigits('ឆ្នាំ២០២២')).toBe('ឆ្នាំ២០២២')
  })

  it('returns an empty string for nothing', () => {
    expect(toKhmerDigits(null)).toBe('')
    expect(toKhmerDigits(undefined)).toBe('')
  })
})

describe('parseYearLabel', () => {
  it('reads a single-session year', () => {
    expect(parseYearLabel('វិញ្ញាសាប្រឡងឆ្នាំ២០២២')).toEqual({ year: '២០២២', round: null })
  })

  it('reads the session of a two-session year without the leading zero', () => {
    expect(parseYearLabel('វិញ្ញាសាប្រឡងឆ្នាំ២០១៤ (លើកទី ០១)')).toEqual({
      year: '២០១៤',
      round: 'លើកទី ១'
    })
    expect(parseYearLabel('វិញ្ញាសាប្រឡងឆ្នាំ២០១៤ (លើកទី ០២)')).toEqual({
      year: '២០១៤',
      round: 'លើកទី ២'
    })
  })

  it('accepts Latin digits', () => {
    expect(parseYearLabel('Exam 2014 (លើកទី 2)')).toEqual({ year: '២០១៤', round: 'លើកទី ២' })
  })

  it('returns an empty year when there is none', () => {
    expect(parseYearLabel('')).toEqual({ year: '', round: null })
    expect(parseYearLabel(undefined)).toEqual({ year: '', round: null })
  })
})

describe('formatSubjectCount', () => {
  it('writes the count in Khmer', () => {
    expect(formatSubjectCount(8)).toBe('៨ មុខវិជ្ជា')
  })
})

describe('formatYearShort', () => {
  it('shortens a year label', () => {
    expect(formatYearShort('វិញ្ញាសាប្រឡងឆ្នាំ២០២២')).toBe('ឆ្នាំ២០២២')
    expect(formatYearShort('វិញ្ញាសាប្រឡងឆ្នាំ២០១៤ (លើកទី ០១)')).toBe('ឆ្នាំ២០១៤ លើកទី ១')
  })

  it('falls back to the label when it has no year', () => {
    expect(formatYearShort('ផ្សេងៗ')).toBe('ផ្សេងៗ')
    expect(formatYearShort('')).toBe('')
  })
})

describe('stripCategoryPrefix', () => {
  it('drops the class prefix', () => {
    expect(stripCategoryPrefix('ថ្នាក់វិទ្យាសាស្ត្រពិត')).toBe('វិទ្យាសាស្ត្រពិត')
    expect(stripCategoryPrefix('ថ្នាក់ វិទ្យាសាស្ត្រសង្គម')).toBe('វិទ្យាសាស្ត្រសង្គម')
  })

  it('keeps labels without the prefix', () => {
    expect(stripCategoryPrefix('វិទ្យាសាស្ត្រពិត')).toBe('វិទ្យាសាស្ត្រពិត')
    expect(stripCategoryPrefix(undefined)).toBe('')
  })
})
