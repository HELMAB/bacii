import { describe, expect, it } from 'vitest'
import { getDocPath } from '../../app/utils/docUrl'

describe('getDocPath', () => {
  it('builds one encoded form for a document', () => {
    expect(getDocPath('/pdfs/science/2018/french.pdf')).toBe(
      '/?pdf=%2Fpdfs%2Fscience%2F2018%2Ffrench.pdf'
    )
  })

  it('encodes the session brackets in 2014 paths', () => {
    expect(getDocPath('/pdfs/society/2014(1)/math.pdf')).toBe(
      '/?pdf=%2Fpdfs%2Fsociety%2F2014%281%29%2Fmath.pdf'
    )
  })

  it('round-trips through URLSearchParams', () => {
    const pdf = '/pdfs/society/2014(2)/math.pdf'
    expect(new URL(getDocPath(pdf), 'https://example.test').searchParams.get('pdf')).toBe(pdf)
  })
})
