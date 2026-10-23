import { useCallback, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

export interface UseResizableWidthOptions {
  /** Prefixo no localStorage: grava `<chave>.width` e `<chave>.collapsed`. Sem chave, não grava. */
  storageKey?: string
  /** Largura inicial e do duplo clique. Padrão 460. */
  defaultWidth?: number
  /** Menor largura. Padrão 320. */
  minWidth?: number
  /** Maior largura, como fração da janela. Padrão 0,6. */
  maxRatio?: number
  /** Rótulo do separador para leitores de tela. */
  label?: string
}

export interface UseResizableWidthResult {
  width: number
  collapsed: boolean
  setCollapsed: (next: boolean) => void
  /** Props para o separador (a alça entre o menu e o palco). */
  handleProps: {
    role: 'separator'
    'aria-orientation': 'vertical'
    'aria-label': string
    'aria-valuenow': number
    'aria-valuemin': number
    tabIndex: number
    onPointerDown: (e: PointerEvent<HTMLElement>) => void
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void
    onDoubleClick: () => void
  }
}

function read(key: string | undefined): string | null {
  if (!key) return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string | undefined, value: string) {
  if (!key) return
  try {
    localStorage.setItem(key, value)
  } catch {
    /* sem armazenamento: volta ao padrão na próxima visita */
  }
}

/**
 * Largura de um menu lateral que se arrasta pela borda, anda com ← / →
 * (Shift = passo maior), volta ao padrão no duplo clique e recolhe. A alça
 * mede a partir da borda esquerda do elemento pai.
 */
export function useResizableWidth({
  storageKey,
  defaultWidth = 460,
  minWidth = 320,
  maxRatio = 0.6,
  label = 'Largura do menu',
}: UseResizableWidthOptions = {}): UseResizableWidthResult {
  const widthKey = storageKey ? `${storageKey}.width` : undefined
  const collapsedKey = storageKey ? `${storageKey}.collapsed` : undefined
  const maxWidth = useCallback(
    () => Math.max(minWidth, Math.round(window.innerWidth * maxRatio)),
    [minWidth, maxRatio],
  )
  const clamp = useCallback(
    (w: number) => Math.min(maxWidth(), Math.max(minWidth, w)),
    [maxWidth, minWidth],
  )

  const [width, setWidth] = useState(() => {
    const saved = Number(read(widthKey))
    return clamp(Number.isFinite(saved) && saved > 0 ? saved : defaultWidth)
  })
  const [collapsed, setCollapsedState] = useState(() => read(collapsedKey) === '1')

  const setCollapsed = useCallback(
    (next: boolean) => {
      setCollapsedState(next)
      write(collapsedKey, next ? '1' : '0')
    },
    [collapsedKey],
  )

  const commit = useCallback(
    (w: number) => {
      const next = clamp(w)
      setWidth(next)
      write(widthKey, String(next))
    },
    [clamp, widthKey],
  )

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    e.preventDefault()
    const handle = e.currentTarget
    const left = handle.parentElement?.getBoundingClientRect().left ?? 0
    handle.setPointerCapture?.(e.pointerId)
    let last = width
    const move = (ev: globalThis.PointerEvent) => {
      last = clamp(ev.clientX - left)
      setWidth(last)
    }
    const stop = (ev: globalThis.PointerEvent) => {
      handle.releasePointerCapture?.(ev.pointerId)
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', stop)
      write(widthKey, String(last))
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', stop)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const step = e.shiftKey ? 60 : 20
    commit(width + (e.key === 'ArrowRight' ? step : -step))
  }

  return {
    width,
    collapsed,
    setCollapsed,
    handleProps: {
      role: 'separator',
      'aria-orientation': 'vertical',
      'aria-label': label,
      'aria-valuenow': width,
      'aria-valuemin': minWidth,
      tabIndex: 0,
      onPointerDown,
      onKeyDown,
      onDoubleClick: () => commit(defaultWidth),
    },
  }
}
