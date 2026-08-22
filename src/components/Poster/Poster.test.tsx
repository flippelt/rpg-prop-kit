import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Poster } from './Poster'

describe('Poster', () => {
  it('monta eyebrow, título, corpo e rodapé', () => {
    const { getByText } = render(
      <Poster eyebrow="AVISO" title="A Fenda" footer="Pedravale">
        Não cruzar a muralha após o sino.
      </Poster>,
    )
    expect(getByText('AVISO')).toBeTruthy()
    expect(getByText('A Fenda')).toBeTruthy()
    expect(getByText(/muralha/)).toBeTruthy()
    expect(getByText('Pedravale')).toBeTruthy()
  })

  it('omite blocos ausentes', () => {
    const { container } = render(<Poster />)
    expect(container.querySelector('.rpk-poster__title')).toBeNull()
    expect(container.querySelector('.rpk-poster__eyebrow')).toBeNull()
    expect(container.querySelector('.rpk-poster__footer')).toBeNull()
  })
})
