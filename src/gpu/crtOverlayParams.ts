/**
 * Opções do overlay CRT em WebGPU. Parte pura (sem GPU), testável no jsdom.
 *
 * O overlay é desenhado POR CIMA do conteúdo e não lê o conteúdo: só
 * escurece (scanlines, grade de abertura, vinheta) e soma um pouco de luz
 * (granulado, faixa de interferência, franja nas bordas, reflexo do vidro).
 * Nada pisca: o granulado é de baixa amplitude e a faixa leva ~20 s para
 * descer a tela.
 */
export interface CrtOverlayOptions {
  /** Linhas horizontais escuras (0..1). Padrão 0,5. */
  scanlines?: number
  /** Grade de abertura: colunas finas escuras, como a máscara do tubo (0..1). Padrão 0,3. */
  mask?: number
  /** Granulado de fósforo animado (0..1). Padrão 0,35. */
  grain?: number
  /** Faixa de interferência descendo devagar (0..1). Padrão 0,3. */
  interference?: number
  /** Escurecimento das bordas (0..1). Padrão 0,5. */
  vignette?: number
  /** Franja de cor nas bordas laterais (0..1). Padrão 0,3. */
  fringe?: number
  /** Reflexo diagonal no vidro (0..1). Padrão 0,3. */
  glare?: number
  /**
   * Cor do fósforo (hex ou rgb()). Omitida, usa a cor de texto herdada pelo
   * canvas (no `CRTScreen`, é `--rpk-fg`).
   */
  color?: string
  /**
   * Desenha um quadro parado. Omitido, segue `prefers-reduced-motion`.
   */
  reducedMotion?: boolean
}

export type ResolvedCrtOverlayOptions = Required<Omit<CrtOverlayOptions, 'color' | 'reducedMotion'>> & {
  color: [number, number, number]
  reducedMotion: boolean
}

export const CRT_OVERLAY_DEFAULTS = {
  scanlines: 0.5,
  mask: 0.3,
  grain: 0.35,
  interference: 0.3,
  vignette: 0.5,
  fringe: 0.3,
  glare: 0.3,
} as const

/** Fósforo verde padrão do pacote (#33ff33). */
const DEFAULT_COLOR: [number, number, number] = [0.2, 1, 0.2]

/** Teto de quadros: o overlay é sutil, 30 fps bastam. */
export const CRT_FRAME_INTERVAL_MS = 1000 / 30

/** Segundos que a faixa de interferência leva para descer a tela. */
export const INTERFERENCE_PERIOD_S = 20

const clamp01 = (v: unknown, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : fallback

/** Converte `#rgb`, `#rrggbb` ou `rgb()/rgba()` em [r,g,b] 0..1; null se não reconhecer. */
export function parseCssColor(input: string | undefined | null): [number, number, number] | null {
  if (!input) return null
  const s = input.trim().toLowerCase()
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(s)
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1]
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number]
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(s)
  if (rgb) {
    return [rgb[1], rgb[2], rgb[3]].map((c) => Math.min(255, Number(c)) / 255) as [
      number,
      number,
      number,
    ]
  }
  return null
}

export function resolveCrtOverlayOptions(
  opts: CrtOverlayOptions,
  fallbackColor?: string | null,
  prefersReducedMotion = false,
): ResolvedCrtOverlayOptions {
  const d = CRT_OVERLAY_DEFAULTS
  return {
    scanlines: clamp01(opts.scanlines, d.scanlines),
    mask: clamp01(opts.mask, d.mask),
    grain: clamp01(opts.grain, d.grain),
    interference: clamp01(opts.interference, d.interference),
    vignette: clamp01(opts.vignette, d.vignette),
    fringe: clamp01(opts.fringe, d.fringe),
    glare: clamp01(opts.glare, d.glare),
    color: parseCssColor(opts.color) ?? parseCssColor(fallbackColor) ?? DEFAULT_COLOR,
    reducedMotion: opts.reducedMotion ?? prefersReducedMotion,
  }
}

/** Layout do uniform do shader (16 floats = 64 bytes). */
export function packCrtUniforms(
  o: ResolvedCrtOverlayOptions,
  width: number,
  height: number,
  time: number,
  pixelRatio: number,
  out = new Float32Array(16),
): Float32Array {
  out[0] = width
  out[1] = height
  out[2] = time
  out[3] = pixelRatio
  out[4] = o.scanlines
  out[5] = o.mask
  out[6] = o.grain
  out[7] = o.interference
  out[8] = o.vignette
  out[9] = o.fringe
  out[10] = o.glare
  out[11] = 1 / INTERFERENCE_PERIOD_S
  out[12] = o.color[0]
  out[13] = o.color[1]
  out[14] = o.color[2]
  out[15] = 0
  return out
}
