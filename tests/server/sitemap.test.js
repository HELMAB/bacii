import { beforeAll, describe, expect, it, vi } from 'vitest'
import docs from '../../public/docs.json'
import { SITE_URL } from '../../app/constants/site'
import { getDocPath } from '../../app/utils/docUrl'

const paperUrls = docs.flatMap((category) =>
  category.children.flatMap((year) =>
    year.children.map((subject) => `${SITE_URL}${getDocPath(subject.pdf)}`)
  )
)

describe('sitemap.xml', () => {
  let xml
  let locs

  beforeAll(async () => {
    vi.stubGlobal('defineEventHandler', (handler) => handler)
    vi.stubGlobal('setResponseHeader', vi.fn())

    const { default: handler } = await import('../../server/routes/sitemap.xml.js')
    xml = handler({})
    locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
  })

  it('lists the homepage first', () => {
    expect(locs[0]).toBe(`${SITE_URL}/`)
  })

  it('lists every exam paper, using the canonical URL form', () => {
    expect(locs.slice(1)).toEqual(paperUrls)
  })

  it('has no duplicate URLs', () => {
    expect(new Set(locs).size).toBe(locs.length)
  })

  it('contains nothing that needs XML escaping', () => {
    expect(locs.join('')).not.toMatch(/[&<>]/)
  })
})
