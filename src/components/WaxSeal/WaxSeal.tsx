import type { CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import './WaxSeal.css'

export type WaxColor = 'crimson' | 'gold' | 'green' | 'charcoal'
export type WaxVariant = 1 | 2 | 3 | 4 | 5 | 6

export interface WaxSealProps {
  /** Glifo gravado no centro (um caractere ou emoji curto). */
  glyph?: string
  /** Lema pequeno na base da cera. */
  motto?: string
  color?: WaxColor
  /** Irregularidade da gota (1–6). Padrão: 1. */
  variant?: WaxVariant
  /** Tamanho em pixels. Padrão: 96. */
  size?: number
  /** Fita pendurada atrás da cera. Padrão: true. */
  ribbon?: boolean
  className?: string
  style?: CSSProperties
}

/** Selo de cera CSS (gota irregular + glifo). Decorativo — aria-hidden. */
export function WaxSeal({
  glyph = '✦',
  motto,
  color = 'crimson',
  variant = 1,
  size = 96,
  ribbon = true,
  className,
  style,
}: WaxSealProps) {
  return (
    <span
      className={cx('rpk-seal', `rpk-seal--${variant}`, className)}
      data-rpk-wax={color}
      style={{ ...style, ['--rpk-seal-size' as string]: `${size}px` }}
      aria-hidden="true"
    >
      {ribbon && <span className="rpk-seal__ribbon" />}
      <span className="rpk-seal__blob" />
      <span className="rpk-seal__glyph">{glyph}</span>
      {motto && <span className="rpk-seal__motto">{motto}</span>}
    </span>
  )
}
