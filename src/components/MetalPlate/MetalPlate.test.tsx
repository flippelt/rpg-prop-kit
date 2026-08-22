import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MetalPlate } from './MetalPlate'

describe('MetalPlate', () => {
  it('renderiza o corpo e o tom', () => {
    const { getByText, container } = render(
      <MetalPlate tone="brass">setor 7</MetalPlate>,
    )
    expect(getByText('setor 7')).toBeTruthy()
    expect(container.querySelector('.rpk-plate')!.getAttribute('data-rpk-metal')).toBe(
      'brass',
    )
  })

  it('desenha quatro rebites por padrão e os remove sob demanda', () => {
    const { container, rerender } = render(<MetalPlate />)
    expect(container.querySelectorAll('.rpk-plate__rivet')).toHaveLength(4)
    rerender(<MetalPlate rivets={false} />)
    expect(container.querySelectorAll('.rpk-plate__rivet')).toHaveLength(0)
  })
})
