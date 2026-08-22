import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import './Parchment.css'

export type ParchmentTone = 'vellum' | 'folio' | 'ash'

export interface ParchmentProps {
  children?: ReactNode
  /** Tom do papel. Padrão: vellum. */
  tone?: ParchmentTone
  /** Linhas de caderno atrás do texto. */
  ruled?: boolean
  /** Marca de xícara no canto. */
  stained?: boolean
  className?: string
  style?: CSSProperties
}

/** Folha de pergaminho: papel quente, opcionalmente pautado e manchado. */
export function Parchment({
  children,
  tone = 'vellum',
  ruled = false,
  stained = false,
  className,
  style,
}: ParchmentProps) {
  return (
    <div
      className={cx(
        'rpk-parchment',
        ruled && 'rpk-parchment--ruled',
        stained && 'rpk-parchment--stained',
        className,
      )}
      data-rpk-parchment={tone}
      style={style}
    >
      <div className="rpk-parchment__body">{children}</div>
    </div>
  )
}
