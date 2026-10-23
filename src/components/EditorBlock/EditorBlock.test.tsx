import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { EditorBlock } from './EditorBlock'

describe('EditorBlock', () => {
  it('começa fechado e mostra título e linha de baixo', () => {
    const { container } = render(
      <EditorBlock title="Terminal" sub="Cabeçalho e prompt">
        <input />
      </EditorBlock>,
    )
    const root = container.querySelector('details.rpk-block') as HTMLDetailsElement
    expect(root.open).toBe(false)
    expect(root.querySelector('.rpk-block__title')!.textContent).toBe('Terminal')
    expect(root.querySelector('.rpk-block__sub')!.textContent).toBe('Cabeçalho e prompt')
    expect(root.querySelector('.rpk-block__body input')).not.toBeNull()
  })

  it('abre com open e marca data-block', () => {
    const { container } = render(
      <EditorBlock title="Tela" open name="tela">
        x
      </EditorBlock>,
    )
    const root = container.querySelector('details') as HTMLDetailsElement
    expect(root.open).toBe(true)
    expect(root.dataset.block).toBe('tela')
  })

  it('omite a linha de baixo sem sub', () => {
    const { container } = render(<EditorBlock title="Avançado">x</EditorBlock>)
    expect(container.querySelector('.rpk-block__sub')).toBeNull()
  })
})
