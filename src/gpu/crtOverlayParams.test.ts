import { describe, expect, it } from 'vitest'
import {
  CRT_OVERLAY_DEFAULTS,
  INTERFERENCE_PERIOD_S,
  packCrtUniforms,
  parseCssColor,
  resolveCrtOverlayOptions,
} from './crtOverlayParams'

describe('parseCssColor', () => {
  it('lê hex curto, hex longo, rgb() e rgba()', () => {
    expect(parseCssColor('#fff')).toEqual([1, 1, 1])
    expect(parseCssColor('#33FF33')).toEqual([0.2, 1, 0.2])
    expect(parseCssColor('rgb(255, 0, 51)')).toEqual([1, 0, 0.2])
    expect(parseCssColor('rgba(0 0 255 / 0.5)')).toEqual([0, 0, 1])
  })

  it('devolve null para o que não reconhece', () => {
    expect(parseCssColor('verde')).toBeNull()
    expect(parseCssColor('')).toBeNull()
    expect(parseCssColor(undefined)).toBeNull()
  })
})

describe('resolveCrtOverlayOptions', () => {
  it('aplica padrões e faz clamp', () => {
    const o = resolveCrtOverlayOptions({ grain: 5, mask: -1, vignette: Number.NaN })
    expect(o.grain).toBe(1)
    expect(o.mask).toBe(0)
    expect(o.vignette).toBe(CRT_OVERLAY_DEFAULTS.vignette)
    expect(o.scanlines).toBe(CRT_OVERLAY_DEFAULTS.scanlines)
  })

  it('cor: opção > cor herdada > verde padrão', () => {
    expect(resolveCrtOverlayOptions({ color: '#ff0000' }, 'rgb(0, 0, 255)').color).toEqual([1, 0, 0])
    expect(resolveCrtOverlayOptions({}, 'rgb(0, 0, 255)').color).toEqual([0, 0, 1])
    expect(resolveCrtOverlayOptions({}, null).color).toEqual([0.2, 1, 0.2])
  })

  it('movimento reduzido: opção explícita vence a media query', () => {
    expect(resolveCrtOverlayOptions({}, null, true).reducedMotion).toBe(true)
    expect(resolveCrtOverlayOptions({ reducedMotion: false }, null, true).reducedMotion).toBe(false)
  })
})

describe('packCrtUniforms', () => {
  it('segue o layout do struct do shader (cor no offset 48)', () => {
    const o = resolveCrtOverlayOptions({ color: '#ff0000', grain: 0.4 })
    const d = packCrtUniforms(o, 800, 600, 2.5, 2)
    expect(d.length).toBe(16)
    expect([...d.slice(0, 4)]).toEqual([800, 600, 2.5, 2])
    expect(d[6]).toBeCloseTo(0.4)
    expect(d[11]).toBeCloseTo(1 / INTERFERENCE_PERIOD_S)
    expect([...d.slice(12, 15)]).toEqual([1, 0, 0])
  })

  it('a faixa de interferência é lenta (sem efeito estroboscópico)', () => {
    expect(INTERFERENCE_PERIOD_S).toBeGreaterThanOrEqual(10)
  })
})
