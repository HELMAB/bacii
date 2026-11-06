// Formatting for Khmer UI text: numerals and the labels used in public/docs.json.

const KHMER_DIGITS = '០១២៣៤៥៦៧៨៩'

// 2022 -> '២០២២'. Anything that isn't a Latin digit is left as it is ('100%' -> '១០០%').
export function toKhmerDigits(value) {
  if (value === null || value === undefined) return ''
  return String(value).replace(/[0-9]/g, (digit) => KHMER_DIGITS[digit])
}

function toLatinDigits(text) {
  return text.replace(/[០-៩]/g, (digit) => KHMER_DIGITS.indexOf(digit))
}

// 'វិញ្ញាសាប្រឡងឆ្នាំ២០១៤ (លើកទី ០១)' -> { year: '២០១៤', round: 'លើកទី ១' }
// 'វិញ្ញាសាប្រឡងឆ្នាំ២០២២'            -> { year: '២០២២', round: null }
export function parseYearLabel(label) {
  const latin = toLatinDigits(label || '')
  const year = latin.match(/\d{4}/)?.[0]
  const round = latin.match(/លើកទី\s*0*(\d+)/)?.[1]

  return {
    year: year ? toKhmerDigits(year) : '',
    round: round ? `លើកទី ${toKhmerDigits(round)}` : null
  }
}

// 8 -> '៨ មុខវិជ្ជា'
export function formatSubjectCount(count) {
  return `${toKhmerDigits(count)} មុខវិជ្ជា`
}

// 'វិញ្ញាសាប្រឡងឆ្នាំ២០២២' -> 'ឆ្នាំ២០២២', with the session for two-session years.
export function formatYearShort(label) {
  const { year, round } = parseYearLabel(label)
  if (!year) return label || ''
  return round ? `ឆ្នាំ${year} ${round}` : `ឆ្នាំ${year}`
}

// 'ថ្នាក់វិទ្យាសាស្ត្រពិត' -> 'វិទ្យាសាស្ត្រពិត'
export function stripCategoryPrefix(label) {
  return (label || '').replace(/^ថ្នាក់\s*/, '')
}
