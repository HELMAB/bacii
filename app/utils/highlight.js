// Splits text into matching and non-matching parts, so a template can wrap the
// matches in <mark> without v-html. Matches the same way useSearch filters
// (case-insensitive substring).
export function splitMatch(text, query) {
  if (!text) return []

  const needle = (query || '').trim().toLowerCase()
  if (!needle) return [{ text, match: false }]

  const haystack = text.toLowerCase()
  const parts = []
  let from = 0
  let index = haystack.indexOf(needle)

  while (index !== -1) {
    if (index > from) parts.push({ text: text.slice(from, index), match: false })
    parts.push({ text: text.slice(index, index + needle.length), match: true })
    from = index + needle.length
    index = haystack.indexOf(needle, from)
  }

  if (from < text.length) parts.push({ text: text.slice(from), match: false })
  return parts
}
