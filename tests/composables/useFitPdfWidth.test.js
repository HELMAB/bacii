import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { getPdfRenderScale, useFitPdfWidth } from '../../app/composables/useFitPdfWidth'
import { withSetup } from '../helpers/withSetup'

function fitWidthFor(clientWidth, maxWidth = 820) {
  const element = document.createElement('div')
  Object.defineProperty(element, 'clientWidth', { value: clientWidth })
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    }
  )
  return withSetup(() => useFitPdfWidth(ref(element), maxWidth)).result
}

describe('useFitPdfWidth', () => {
  it('fits a phone screen, minus the page gutter', () => {
    expect(fitWidthFor(360).value).toBe(344)
  })

  it('stops growing at the maximum width', () => {
    expect(fitWidthFor(1600).value).toBe(820)
  })

  it('uses the maximum width until the container is measured', () => {
    expect(fitWidthFor(0).value).toBe(820)
  })
})

describe('getPdfRenderScale', () => {
  afterEach(() => vi.unstubAllGlobals())

  const setPixelRatio = (ratio) => vi.stubGlobal('devicePixelRatio', ratio)

  it('keeps full resolution at normal zoom on a 3x phone', () => {
    setPixelRatio(3)
    expect(getPdfRenderScale(344)).toBe(1)
  })

  it('limits canvas width at high zoom on a 3x phone', () => {
    setPixelRatio(3)
    expect(getPdfRenderScale(688) * 3 * 688).toBeCloseTo(1600)
  })

  it('never drops below 2x, so text stays sharp', () => {
    setPixelRatio(3)
    expect(getPdfRenderScale(1640) * 3).toBeCloseTo(2)
  })

  it('leaves 1x screens alone', () => {
    setPixelRatio(1)
    expect(getPdfRenderScale(820)).toBe(1)
  })
})
