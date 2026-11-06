// @vitest-environment node
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import docs from '../../public/docs.json'
import { subjectIcons } from '../../app/constants/icons'
import { parseYearLabel } from '../../app/utils/khmer'

const publicDir = fileURLToPath(new URL('../../public', import.meta.url))

const toLatinDigits = (text) => text.replace(/[០-៩]/g, (digit) => '០១២៣៤៥៦៧៨៩'.indexOf(digit))

const leaves = docs.flatMap((category) =>
  category.children.flatMap((year) =>
    year.children.map((subject) => ({ ...subject, category: category.label, year: year.label }))
  )
)

const describeLeaf = ({ category, year, label }) => `${category} / ${year} / ${label}`

describe('docs.json', () => {
  it('gives every entry a label, a PDF path and an icon', () => {
    for (const leaf of leaves) {
      expect(leaf.label, describeLeaf(leaf)).toBeTruthy()
      expect(leaf.pdf, describeLeaf(leaf)).toMatch(/^\/pdfs\/.+\.pdf$/)
      expect(leaf.icon, describeLeaf(leaf)).toBeTruthy()
    }
  })

  it('points every entry at a file that exists', () => {
    const missing = leaves.filter((leaf) => !existsSync(publicDir + leaf.pdf)).map(describeLeaf)
    expect(missing).toEqual([])
  })

  it('never uses the same PDF twice', () => {
    const paths = leaves.map((leaf) => leaf.pdf)
    expect(paths.filter((path, index) => paths.indexOf(path) !== index)).toEqual([])
  })

  it('files every entry under the year it claims to be', () => {
    const wrongYear = leaves
      .filter((leaf) => {
        const year = toLatinDigits(leaf.year).match(/\d{4}/)?.[0]
        return !leaf.pdf.includes(`/${year}`)
      })
      .map((leaf) => `${describeLeaf(leaf)} -> ${leaf.pdf}`)

    expect(wrongYear).toEqual([])
  })

  it('uses one filename per subject', () => {
    const filenames = {}
    for (const leaf of leaves) {
      filenames[leaf.label] ??= new Set()
      filenames[leaf.label].add(leaf.pdf.split('/').pop())
    }

    const inconsistent = Object.entries(filenames).filter(([, names]) => names.size > 1)
    expect(inconsistent).toEqual([])
  })

  it('has an icon mapped for every subject', () => {
    const unmapped = [...new Set(leaves.map((leaf) => leaf.label))].filter(
      (label) => !subjectIcons[label]
    )
    expect(unmapped).toEqual([])
  })

  // The sidebar ledger shows the parsed year, so a new label format must still parse.
  it('gives every year label a readable year', () => {
    const unreadable = docs
      .flatMap((category) => category.children.map((year) => year.label))
      .filter((label) => !parseYearLabel(label).year)
    expect(unreadable).toEqual([])
  })
})
