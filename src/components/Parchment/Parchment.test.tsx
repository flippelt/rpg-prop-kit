import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Parchment } from './Parchment'

describe('Parchment', () => {
  it('renderiza os children no corpo', () => {
    const { getByText, container } = render(
      <Parchment>
        <p>carta</p>
      </Parchment>,
    )
    const body = container.querySelector('.rpk-parchment__body')!
    expect(body.contains(getByText('carta'))).toBe(true)
  })

  it('usa vellum por padrão e encaminha o tom', () => {
    const { container, rerender } = render(<Parchment />)
    const root = container.querySelector('.rpk-parchment')!
    expect(root.getAttribute('data-rpk-parchment')).toBe('vellum')

    rerender(<Parchment tone="ash" />)
    expect(
      container.querySelector('.rpk-parchment')!.getAttribute('data-rpk-parchment'),
    ).toBe('ash')
  })

  it('liga ruled e stained só quando pedidos', () => {
    const { container, rerender } = render(<Parchment />)
    const root = () => container.querySelector('.rpk-parchment')!
    expect(root().className).not.toContain('rpk-parchment--ruled')
    expect(root().className).not.toContain('rpk-parchment--stained')

    rerender(<Parchment ruled stained />)
    expect(root().className).toContain('rpk-parchment--ruled')
    expect(root().className).toContain('rpk-parchment--stained')
  })
})
