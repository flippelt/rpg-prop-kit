import type { CSSProperties, ReactNode } from 'react'
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
  /** Classe extra aplicada ao container externo. */
  className?: string
  /** Estilos inline no container externo. */
  style?: CSSProperties
}

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ')

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
  className,
  style,
}: CRTScreenProps) {
  return (
    <div
      className={cx(
        'rpk-crt',
        fullscreen && 'rpk-crt--fullscreen',
        scanlines && 'rpk-crt--scanlines',
        sweep && 'rpk-crt--sweep',
        curvature && 'rpk-crt--curved',
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
      </div>
    </div>
  )
}
