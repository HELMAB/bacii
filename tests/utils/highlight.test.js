import { describe, expect, it } from 'vitest'
import { splitMatch } from '../../app/utils/highlight'

describe('splitMatch', () => {
  it('returns the whole text unmatched for an empty query', () => {
    expect(splitMatch('គណិតវិទ្យា', '')).toEqual([{ text: 'គណិតវិទ្យា', match: false }])
    expect(splitMatch('គណិតវិទ្យា', '   ')).toEqual([{ text: 'គណិតវិទ្យា', match: false }])
  })

  it('marks the matching part', () => {
    expect(splitMatch('គណិតវិទ្យា', 'វិទ្យា')).toEqual([
      { text: 'គណិត', match: false },
      { text: 'វិទ្យា', match: true }
    ])
  })

  it('marks every occurrence, ignoring case', () => {
    expect(splitMatch('Physics and physics', 'PHYS')).toEqual([
      { text: 'Phys', match: true },
      { text: 'ics and ', match: false },
      { text: 'phys', match: true },
      { text: 'ics', match: false }
    ])
  })

  it('returns the text unmatched when the query is absent', () => {
    expect(splitMatch('គីមីវិទ្យា', 'ភាសា')).toEqual([{ text: 'គីមីវិទ្យា', match: false }])
  })

  it('handles missing text', () => {
    expect(splitMatch(undefined, 'a')).toEqual([])
  })
})
