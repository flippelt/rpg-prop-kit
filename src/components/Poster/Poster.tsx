import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import './Poster.css'

export interface PosterProps {
  /** Linha curta acima do título (ex.: PROCURADO). */
  eyebrow?: string
  title?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
  style?: CSSProperties
}

/** Cartaz de aviso / procurado: moldura dupla, título em caixa alta. */
export function Poster({
  eyebrow,
  title,
  children,
  footer,
  className,
  style,
}: PosterProps) {
  return (
    <article className={cx('rpk-poster', className)} style={style}>
      {eyebrow && <span className="rpk-poster__eyebrow">{eyebrow}</span>}
      {title && <h2 className="rpk-poster__title">{title}</h2>}
      {children && <div className="rpk-poster__body">{children}</div>}
      {footer && <footer className="rpk-poster__footer">{footer}</footer>}
    </article>
  )
}
