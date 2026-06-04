import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, render } from '@testing-library/react'
import { BootSequence } from './BootSequence'

describe('BootSequence', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('digita as linhas em sequência, esperando lineDelay entre elas', () => {
    const { container } = render(
      <BootSequence lines={['one', 'two']} speed={10} lineDelay={50} />,
    )

    // Só a primeira linha está montada antes de qualquer tick.
    expect(container.querySelectorAll('.rpk-boot__line')).toHaveLength(1)

    act(() => void vi.advanceTimersByTime(30)) // termina "one"
    expect(container.textContent).toContain('one')
    // Ainda na pausa entre linhas: a segunda não montou.
    expect(container.querySelectorAll('.rpk-boot__line')).toHaveLength(1)

    act(() => void vi.advanceTimersByTime(50)) // vence o lineDelay
    expect(container.querySelectorAll('.rpk-boot__line')).toHaveLength(2)

    act(() => void vi.advanceTimersByTime(30)) // termina "two"
    expect(container.textContent).toContain('onetwo')
  })

  it('chama onDone uma vez ao terminar a última linha', () => {
    const onDone = vi.fn()
    render(
      <BootSequence
        lines={['a', 'b']}
        speed={10}
        lineDelay={20}
        onDone={onDone}
      />,
    )

    act(() => void vi.advanceTimersByTime(10)) // termina "a"
    expect(onDone).not.toHaveBeenCalled()

    act(() => void vi.advanceTimersByTime(20)) // lineDelay
    act(() => void vi.advanceTimersByTime(10)) // termina "b"
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('aplica a classe de status conforme o tipo da linha', () => {
    const { container } = render(
      <BootSequence
        lines={[
          { text: 'ok line', status: 'ok' },
          { text: 'err line', status: 'error' },
        ]}
        speed={10}
        lineDelay={10}
      />,
    )

    // Revela ambas as linhas.
    act(() => void vi.advanceTimersByTime(100))

    const lines = container.querySelectorAll('.rpk-boot__line')
    expect(lines[0].className).toContain('rpk-boot__line--ok')
    expect(lines[1].className).toContain('rpk-boot__line--error')
  })

  it('linhas com status default não recebem classe de status extra', () => {
    const { container } = render(
      <BootSequence lines={['plain']} speed={0} />,
    )
    const line = container.querySelector('.rpk-boot__line')!
    expect(line.className).toBe('rpk-boot__line')
  })

  it('encaminha className extra para o container', () => {
    const { container } = render(
      <BootSequence lines={['x']} speed={0} className="custom" />,
    )
    const root = container.querySelector('.rpk-boot')!
    expect(root.className).toContain('custom')
  })
})
