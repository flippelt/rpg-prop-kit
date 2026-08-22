import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import './Dataslate.css'

export type DataslateTone = 'imperial' | 'union' | 'amber'

export interface DataslateProps {
  children?: ReactNode
  tone?: DataslateTone
  /** Scanlines no LCD. Padrão: true. */
  scanlines?: boolean
  className?: string
  style?: CSSProperties
}

/** Tablete sci-fi: moldura + LCD. */
export function Dataslate({
  children,
  tone = 'imperial',
  scanlines = true,
  className,
  style,
}: DataslateProps) {
  return (
    <div
      className={cx('rpk-slate', scanlines && 'rpk-slate--scanlines', className)}
      data-rpk-slate={tone}
      style={style}
    >
      <div className="rpk-slate__lcd">
        <span className="rpk-slate__led" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}
