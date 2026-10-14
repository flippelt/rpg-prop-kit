import { useState, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { CRTGpuOverlay } from '../CRTGpuOverlay'
import type { CrtOverlayOptions } from '../../gpu/crtOverlayParams'
import './CRTScreen.css'

export type CRTTheme = 'phosphor' | 'amber' | 'ice'

export interface CRTScreenProps {
  /** Conteúdo renderizado dentro da tela. */
  children?: ReactNode
  /**
   * Tema de cor embutido. Omita para herdar as variáveis CSS de um ancestral
   * (ex.: definir `--rpk-fg` você mesmo).
   */
  theme?: CRTTheme
  /** Ocupa a viewport inteira (position: fixed) em vez do box do pai. */
  fullscreen?: boolean
  /** Overlay de scanlines horizontais. Padrão: true. */
  scanlines?: boolean
  /** Tremor sutil de opacidade no conteúdo. Padrão: true. */
  flicker?: boolean
  /** Faixa de luz que desce lentamente pela tela. Padrão: true. */
  sweep?: boolean
  /** Escurecimento das bordas. Padrão: true. */
  vignette?: boolean
  /** Leve inclinação 3D da tela. Padrão: true. */
  curvature?: boolean
  /**
   * Liga o overlay em WebGPU (grade de abertura, granulado, interferência,
   * franja e reflexo) por cima do conteúdo. Quando a GPU assume, as
   * scanlines, o sweep e a vinheta em CSS saem para não duplicar. Sem
   * WebGPU, fica tudo em CSS. Aceita opções finas. Padrão: false.
   */
  gpu?: boolean | CrtOverlayOptions
  /** Classe extra aplicada ao container externo. */
  className?: string
  /** Estilos inline no container externo. */
  style?: CSSProperties
}

/**
 * Moldura de monitor CRT retrô. Renderiza a casca (gradiente de fósforo,
 * scanlines, sweep, vignette, flicker e curvatura) e exibe `children` na
 * área de conteúdo rolável. Cada efeito é alternável por prop.
 */
export function CRTScreen({
  children,
  theme,
  fullscreen = false,
  scanlines = true,
  flicker = true,
  sweep = true,
  vignette = true,
  curvature = true,
  gpu = false,
  className,
  style,
}: CRTScreenProps) {
  const [gpuActive, setGpuActive] = useState(false)
  const gpuOpts: CrtOverlayOptions | null = gpu
    ? {
        ...(scanlines ? {} : { scanlines: 0 }),
        ...(vignette ? {} : { vignette: 0 }),
        ...(sweep ? {} : { interference: 0 }),
        ...(typeof gpu === 'object' ? gpu : {}),
      }
    : null
  const useGpu = gpuOpts !== null && gpuActive

  return (
    <div
      className={cx(
        'rpk-crt',
        fullscreen && 'rpk-crt--fullscreen',
        scanlines && 'rpk-crt--scanlines',
        sweep && 'rpk-crt--sweep',
        curvature && 'rpk-crt--curved',
        useGpu && 'rpk-crt--gpu',
        className,
      )}
      data-rpk-theme={theme}
      style={style}
    >
      <div className="rpk-crt__screen">
        {vignette && <div className="rpk-crt__vignette" aria-hidden="true" />}
        <div className={cx('rpk-crt__content', flicker && 'rpk-crt__content--flicker')}>
          {children}
        </div>
        {gpuOpts && (
          <CRTGpuOverlay
            {...gpuOpts}
            onStatusChange={(status) => setGpuActive(status === 'gpu')}
          />
        )}
      </div>
    </div>
  )
}
