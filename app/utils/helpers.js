export function extractYear(label) {
  const match = label.match(/\d{4}/)
  return match ? match[0] : ''
}
