import { useState } from 'react'
import type { CSSProperties } from 'react'
import { TypeWriter } from '../TypeWriter'
import { cx } from '../../utils/cx'
import './BootSequence.css'

export type BootStatus = 'default' | 'ok' | 'error' | 'muted'

export interface BootLine {
  text: string
  /** Cor da linha. Padrão: 'default' (cor do fósforo). */
  status?: BootStatus
}

export interface BootSequenceProps {
  /** Linhas a exibir. Strings simples viram linhas com status 'default'. */
  lines: Array<string | BootLine>
  /** Milissegundos por caractere em cada linha. Padrão: 18. */
  speed?: number
  /** Pausa (ms) entre o fim de uma linha e o início da próxima. Padrão: 220. */
  lineDelay?: number
  /** Mantém o cursor piscando na última linha ao terminar. Padrão: true. */
  cursor?: boolean
  /** Chamado quando a última linha termina. */
  onDone?: () => void
  className?: string
  style?: CSSProperties
}

const STATUS_CLASS: Record<BootStatus, string | false> = {
  default: false,
  ok: 'rpk-boot__line--ok',
  error: 'rpk-boot__line--error',
  muted: 'rpk-boot__line--muted',
}

const normalize = (line: string | BootLine): BootLine =>
  typeof line === 'string' ? { text: line } : line

/**
 * Exibe uma sequência de linhas no estilo "boot de terminal": cada linha é
 * digitada com o TypeWriter e, ao terminar, a próxima começa após `lineDelay`.
 */
export function BootSequence({
  lines,
  speed = 18,
  lineDelay = 220,
  cursor = true,
  onDone,
  className,
  style,
}: BootSequenceProps) {
  const items = lines.map(normalize)
  // Índice da linha que está sendo digitada agora; as anteriores ficam fixas.
  const [current, setCurrent] = useState(0)

  const handleLineDone = (index: number) => {
    if (index >= items.length - 1) {
      onDone?.()
      return
    }
    window.setTimeout(() => {
      setCurrent((c) => Math.max(c, index + 1))
    }, lineDelay)
  }

  return (
    <div className={cx('rpk-boot', className)} style={style}>
      {items.slice(0, current + 1).map((line, i) => {
        const isLast = i === items.length - 1
        return (
          <div key={i} className={cx('rpk-boot__line', STATUS_CLASS[line.status ?? 'default'])}>
            {i < current ? (
              <span>{line.text}</span>
            ) : (
              <TypeWriter
                text={line.text}
                speed={speed}
                cursor={cursor && isLast}
                onDone={() => handleLineDone(i)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
