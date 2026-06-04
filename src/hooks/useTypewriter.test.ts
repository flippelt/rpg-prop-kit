import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTypewriter } from './useTypewriter'

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('revela o texto caractere a caractere no ritmo de `speed`', () => {
    const { result } = renderHook(() => useTypewriter('abc', { speed: 10 }))

    // Antes de qualquer tick: nada revelado.
    expect(result.current.output).toBe('')
    expect(result.current.done).toBe(false)

    act(() => void vi.advanceTimersByTime(10))
    expect(result.current.output).toBe('a')

    act(() => void vi.advanceTimersByTime(10))
    expect(result.current.output).toBe('ab')

    act(() => void vi.advanceTimersByTime(10))
    expect(result.current.output).toBe('abc')
    expect(result.current.done).toBe(true)
  })

  it('respeita o `startDelay` antes de começar', () => {
    const { result } = renderHook(() =>
      useTypewriter('hi', { speed: 10, startDelay: 50 }),
    )

    act(() => void vi.advanceTimersByTime(40))
    expect(result.current.output).toBe('')

    act(() => void vi.advanceTimersByTime(10)) // chega ao startDelay
    act(() => void vi.advanceTimersByTime(10)) // primeiro caractere
    expect(result.current.output).toBe('h')
  })

  it('dispara onDone uma única vez ao terminar', () => {
    const onDone = vi.fn()
    renderHook(() => useTypewriter('ab', { speed: 10, onDone }))

    act(() => void vi.advanceTimersByTime(10))
    expect(onDone).not.toHaveBeenCalled()

    act(() => void vi.advanceTimersByTime(10))
    expect(onDone).toHaveBeenCalledTimes(1)

    // Avançar mais não dispara de novo.
    act(() => void vi.advanceTimersByTime(100))
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('revela tudo de imediato quando speed <= 0', () => {
    const onDone = vi.fn()
    const { result } = renderHook(() =>
      useTypewriter('instantâneo', { speed: 0, onDone }),
    )

    expect(result.current.output).toBe('instantâneo')
    expect(result.current.done).toBe(true)
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('revela tudo de imediato quando prefers-reduced-motion está ativo', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    )

    const { result } = renderHook(() => useTypewriter('texto', { speed: 30 }))
    expect(result.current.output).toBe('texto')
    expect(result.current.done).toBe(true)
  })

  it('limpa os timers ao desmontar (sem revelar mais nada)', () => {
    const { result, unmount } = renderHook(() =>
      useTypewriter('abcdef', { speed: 10 }),
    )

    act(() => void vi.advanceTimersByTime(20))
    expect(result.current.output).toBe('ab')

    unmount()
    // Após desmontar, os intervalos pendentes não devem mais disparar.
    act(() => void vi.advanceTimersByTime(100))
    expect(result.current.output).toBe('ab')
  })

  it('reinicia a animação quando o texto muda', () => {
    const { result, rerender } = renderHook(
      ({ text }) => useTypewriter(text, { speed: 10 }),
      { initialProps: { text: 'old' } },
    )

    act(() => void vi.advanceTimersByTime(30))
    expect(result.current.output).toBe('old')
    expect(result.current.done).toBe(true)

    rerender({ text: 'new' })
    expect(result.current.output).toBe('')
    expect(result.current.done).toBe(false)

    act(() => void vi.advanceTimersByTime(10))
    expect(result.current.output).toBe('n')
  })

  it('não reinicia a animação quando apenas o onDone muda', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { result, rerender } = renderHook(
      ({ cb }) => useTypewriter('ab', { speed: 10, onDone: cb }),
      { initialProps: { cb: first } },
    )

    act(() => void vi.advanceTimersByTime(10))
    expect(result.current.output).toBe('a')

    // Troca o callback no meio da digitação — não deve reiniciar.
    rerender({ cb: second })
    act(() => void vi.advanceTimersByTime(10))
    expect(result.current.output).toBe('ab')

    // O callback usado ao finalizar é o mais recente.
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})
