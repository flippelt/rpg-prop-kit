import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CRTScreen } from './CRTScreen'

describe('CRTScreen', () => {
  it('renderiza os children dentro da área de conteúdo', () => {
    const { getByText, container } = render(
      <CRTScreen>
        <p>conteúdo</p>
      </CRTScreen>,
    )
    const content = container.querySelector('.rpk-crt__content')!
    expect(content.contains(getByText('conteúdo'))).toBe(true)
  })

  it('aplica todos os efeitos por padrão', () => {
    const { container } = render(<CRTScreen />)
    const root = container.querySelector('.rpk-crt')!

    expect(root.className).toContain('rpk-crt--scanlines')
    expect(root.className).toContain('rpk-crt--sweep')
    expect(root.className).toContain('rpk-crt--curved')
    expect(container.querySelector('.rpk-crt__vignette')).not.toBeNull()
    expect(
      container.querySelector('.rpk-crt__content--flicker'),
    ).not.toBeNull()
  })

  it('remove as classes/elementos dos efeitos desligados', () => {
    const { container } = render(
      <CRTScreen
        scanlines={false}
        sweep={false}
        curvature={false}
        vignette={false}
        flicker={false}
      />,
    )
    const root = container.querySelector('.rpk-crt')!

    expect(root.className).not.toContain('rpk-crt--scanlines')
    expect(root.className).not.toContain('rpk-crt--sweep')
    expect(root.className).not.toContain('rpk-crt--curved')
    expect(container.querySelector('.rpk-crt__vignette')).toBeNull()
    expect(container.querySelector('.rpk-crt__content--flicker')).toBeNull()
  })

  it('adiciona a classe fullscreen apenas quando solicitado', () => {
    const { container, rerender } = render(<CRTScreen />)
    expect(
      container.querySelector('.rpk-crt')!.className,
    ).not.toContain('rpk-crt--fullscreen')

    rerender(<CRTScreen fullscreen />)
    expect(container.querySelector('.rpk-crt')!.className).toContain(
      'rpk-crt--fullscreen',
    )
  })

  it('expõe o tema via data-rpk-theme e encaminha className/style', () => {
    const { container } = render(
      <CRTScreen theme="amber" className="extra" style={{ width: 100 }} />,
    )
    const root = container.querySelector('.rpk-crt') as HTMLElement

    expect(root.getAttribute('data-rpk-theme')).toBe('amber')
    expect(root.className).toContain('extra')
    expect(root.style.width).toBe('100px')
  })

  it('não define data-rpk-theme quando nenhum tema é passado', () => {
    const { container } = render(<CRTScreen />)
    const root = container.querySelector('.rpk-crt')!
    expect(root.getAttribute('data-rpk-theme')).toBeNull()
  })
})
