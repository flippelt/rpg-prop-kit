import { useEffect, useRef, useState } from 'react'

export interface UseTypewriterOptions {
  /** Milissegundos por caractere. Padrão: 28. Use 0 para revelar de imediato. */
  speed?: number
  /** Atraso (ms) antes de começar a digitar. Padrão: 0. */
  startDelay?: number
  /** Chamado quando o texto termina de ser digitado. */
  onDone?: () => void
}

export interface UseTypewriterResult {
  /** Trecho já revelado do texto. */
  output: string
  /** `true` quando todo o texto foi digitado. */
  done: boolean
}

/**
 * Revela `text` caractere a caractere. Respeita `prefers-reduced-motion`
 * (mostra tudo de uma vez) e é seguro para SSR.
 */
export function useTypewriter(
  text: string,
  { speed = 28, startDelay = 0, onDone }: UseTypewriterOptions = {},
): UseTypewriterResult {
  const [output, setOutput] = useState('')
  const [done, setDone] = useState(false)

  // Mantém o callback atual sem reiniciar a animação quando ele muda.
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || speed <= 0) {
      setOutput(text)
      setDone(true)
      onDoneRef.current?.()
      return
    }

    setOutput('')
    setDone(false)

    let i = 0
    let interval: ReturnType<typeof setInterval> | undefined

    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setOutput(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
          onDoneRef.current?.()
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      if (interval) clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { output, done }
}
