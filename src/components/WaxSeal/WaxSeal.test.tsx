import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { WaxSeal } from './WaxSeal'

describe('WaxSeal', () => {
  it('grava o glifo e marca a cor', () => {
    const { container } = render(<WaxSeal glyph="V" color="gold" />)
    const root = container.querySelector('.rpk-seal')!
    expect(root.getAttribute('data-rpk-wax')).toBe('gold')
    expect(root.querySelector('.rpk-seal__glyph')!.textContent).toBe('V')
  })

  it('é decorativo (aria-hidden)', () => {
    const { container } = render(<WaxSeal />)
    expect(container.querySelector('.rpk-seal')!.getAttribute('aria-hidden')).toBe(
      'true',
    )
  })

  it('omite a fita quando ribbon=false', () => {
    const { container, rerender } = render(<WaxSeal />)
    expect(container.querySelector('.rpk-seal__ribbon')).not.toBeNull()
    rerender(<WaxSeal ribbon={false} />)
    expect(container.querySelector('.rpk-seal__ribbon')).toBeNull()
  })

  it('aplica a variante da gota', () => {
    const { container } = render(<WaxSeal variant={4} />)
    expect(container.querySelector('.rpk-seal')!.className).toContain('rpk-seal--4')
  })
})
