import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import './EditorBlock.css'

export interface EditorBlockProps {
  /** Nome do bloco, no `<summary>`. */
  title: ReactNode
  /** Uma linha do que há dentro. Aparece mesmo com o bloco fechado. */
  sub?: ReactNode
  /** Começa aberto. Padrão: fechado. */
  open?: boolean
  /** Vai para `data-block`, para achar o bloco a partir de uma prévia. */
  name?: string
  className?: string
  children: ReactNode
}

/**
 * Bloco de formulário de editor: um `<details>` que começa fechado e diz em
 * uma linha o que guarda. Com vários em sequência, o menu fechado funciona
 * como sumário. Cores pelas variáveis `--rpk-block-*`.
 */
export function EditorBlock({ title, sub, open, name, className, children }: EditorBlockProps) {
  return (
    <details className={cx('rpk-block', className)} open={open} data-block={name}>
      <summary className="rpk-block__summary">
        <span className="rpk-block__title">{title}</span>
        {sub ? <small className="rpk-block__sub">{sub}</small> : null}
      </summary>
      <div className="rpk-block__body">{children}</div>
    </details>
  )
}
