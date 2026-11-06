import docs from '~~/public/docs.json'
import { SITE_URL } from '~~/app/constants/site.js'
import { getDocPath } from '~~/app/utils/docUrl.js'

// Built from docs.json so a new exam paper is listed without touching this file.
export default defineEventHandler((event) => {
  const paths = ['/']
  for (const category of docs) {
    for (const year of category.children) {
      for (const subject of year.children) {
        paths.push(getDocPath(subject.pdf))
      }
    }
  }

  const urls = paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')

  setResponseHeader(event, 'Content-Type', 'application/xml')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})
