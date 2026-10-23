import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { KeyboardEvent } from 'react'
import { useResizableWidth } from './useResizableWidth'

const key = (k: string, shiftKey = false) =>
  ({ key: k, shiftKey, preventDefault: () => {} }) as unknown as KeyboardEvent<HTMLElement>

describe('useResizableWidth', () => {
  beforeEach(() => {
    localStorage.clear()
    window.innerWidth = 1600
  })

  it('começa no padrão e anda com as setas', () => {
    const { result } = renderHook(() => useResizableWidth({ storageKey: 'teste.desk' }))
    expect(result.current.width).toBe(460)
    act(() => result.current.handleProps.onKeyDown(key('ArrowRight')))
    expect(result.current.width).toBe(480)
    act(() => result.current.handleProps.onKeyDown(key('ArrowLeft', true)))
    expect(result.current.width).toBe(420)
    expect(localStorage.getItem('teste.desk.width')).toBe('420')
  })

  it('lê a largura gravada e respeita os limites', () => {
    localStorage.setItem('teste.desk.width', '5000')
    const { result } = renderHook(() => useResizableWidth({ storageKey: 'teste.desk' }))
    expect(result.current.width).toBe(960)
    for (let i = 0; i < 15; i++) act(() => result.current.handleProps.onKeyDown(key('ArrowLeft', true)))
    expect(result.current.width).toBe(320)
  })

  it('duplo clique volta ao padrão; recolher fica gravado', () => {
    localStorage.setItem('teste.desk.width', '600')
    const { result } = renderHook(() => useResizableWidth({ storageKey: 'teste.desk' }))
    act(() => result.current.handleProps.onDoubleClick())
    expect(result.current.width).toBe(460)
    act(() => result.current.setCollapsed(true))
    expect(result.current.collapsed).toBe(true)
    expect(localStorage.getItem('teste.desk.collapsed')).toBe('1')
  })

  it('sem storageKey não grava nada', () => {
    const { result } = renderHook(() => useResizableWidth())
    act(() => result.current.handleProps.onKeyDown(key('ArrowRight')))
    expect(localStorage.length).toBe(0)
  })
})
