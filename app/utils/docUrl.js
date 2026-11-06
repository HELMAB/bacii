// The one URL for a document. Canonical tags, the sitemap and in-app links must all
// use this exact form, or search engines treat them as different pages.
export function getDocPath(pdf) {
  return `/?${new URLSearchParams({ pdf })}`
}
