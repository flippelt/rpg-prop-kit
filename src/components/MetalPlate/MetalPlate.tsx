import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import './MetalPlate.css'

export type MetalTone = 'iron' | 'brass' | 'gunmetal'

const RIVETS = ['tl', 'tr', 'bl', 'br'] as const

export interface MetalPlateProps {
  children?: ReactNode
  tone?: MetalTone
  /** Rebites nos quatro cantos. Padrão: true. */
  rivets?: boolean
  className?: string
  style?: CSSProperties
}

/** Placa de metal escovado (ferro / latão / gunmetal). */
export function MetalPlate({
  children,
  tone = 'iron',
  rivets = true,
  className,
  style,
}: MetalPlateProps) {
  return (
    <div
      className={cx('rpk-plate', className)}
      data-rpk-metal={tone}
      style={style}
    >
      {rivets &&
        RIVETS.map((corner) => (
          <span
            key={corner}
            className={cx('rpk-plate__rivet', `rpk-plate__rivet--${corner}`)}
            aria-hidden="true"
          />
        ))}
      <div className="rpk-plate__body">{children}</div>
    </div>
  )
}
