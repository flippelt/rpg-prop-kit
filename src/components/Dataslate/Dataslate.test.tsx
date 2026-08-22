import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Dataslate } from './Dataslate'

describe('Dataslate', () => {
  it('renderiza o LCD com o tom', () => {
    const { getByText, container } = render(
      <Dataslate tone="union">prioridade verde</Dataslate>,
    )
    expect(getByText('prioridade verde')).toBeTruthy()
    expect(container.querySelector('.rpk-slate')!.getAttribute('data-rpk-slate')).toBe(
      'union',
    )
    expect(container.querySelector('.rpk-slate__lcd')).not.toBeNull()
  })

  it('liga scanlines por padrão', () => {
    const { container, rerender } = render(<Dataslate />)
    expect(container.querySelector('.rpk-slate')!.className).toContain(
      'rpk-slate--scanlines',
    )
    rerender(<Dataslate scanlines={false} />)
    expect(container.querySelector('.rpk-slate')!.className).not.toContain(
      'rpk-slate--scanlines',
    )
  })
})
