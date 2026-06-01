import type { CSSProperties } from 'react'
import { useTypewriter } from '../../hooks/useTypewriter'
import { cx } from '../../utils/cx'
import './TypeWriter.css'

export interface TypeWriterProps {
  /** Texto a ser digitado. */
  text: string
  /** Milissegundos por caractere. Padrão: 28. */
  speed?: number
  /** Atraso (ms) antes de começar. Padrão: 0. */
  startDelay?: number
  /** Mantém um cursor piscando depois de terminar. Padrão: false. */
  cursor?: boolean
  /** Chamado quando termina de digitar. */
  onDone?: () => void
  className?: string
  style?: CSSProperties
}

/**
 * Digita um texto caractere a caractere, com um cursor piscando enquanto
 * escreve (e, opcionalmente, depois de terminar).
 */
export function TypeWriter({
  text,
  speed,
  startDelay,
  cursor = false,
  onDone,
  className,
  style,
}: TypeWriterProps) {
  const { output, done } = useTypewriter(text, { speed, startDelay, onDone })
  const showCaret = !done || cursor

  return (
    <span className={cx('rpk-typewriter', className)} style={style}>
      {output}
      {showCaret && <span className="rpk-caret" aria-hidden="true" />}
    </span>
  )
}
