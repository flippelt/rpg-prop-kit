import { useEffect, useRef, type CSSProperties } from 'react'
import { createCrtOverlay, type CrtOverlay } from '../../gpu/crtOverlay'
import type { CrtOverlayOptions } from '../../gpu/crtOverlayParams'
import { cx } from '../../utils/cx'
import './CRTGpuOverlay.css'

export type CRTGpuStatus = 'gpu' | 'unsupported'

export interface CRTGpuOverlayProps extends CrtOverlayOptions {
  /** Avisado quando o overlay liga (`gpu`) ou não há WebGPU (`unsupported`). */
  onStatusChange?: (status: CRTGpuStatus) => void
  /** Classe extra no canvas. */
  className?: string
  /** Estilos inline no canvas (ex.: z-index). */
  style?: CSSProperties
}

/**
 * Overlay CRT em WebGPU: scanlines, grade de abertura, granulado,
 * interferência, vinheta, franja e reflexo, desenhados num canvas por cima
 * do conteúdo (sem capturar cliques). Posicione dentro de um container com
 * `position: relative`. Sem WebGPU, não desenha nada e avisa `unsupported`.
 */
export function CRTGpuOverlay({
  onStatusChange,
  className,
  style,
  scanlines,
  mask,
  grain,
  interference,
  vignette,
  fringe,
  glare,
  color,
  reducedMotion,
}: CRTGpuOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<CrtOverlay | null>(null)
  const opts: CrtOverlayOptions = {
    scanlines,
    mask,
    grain,
    interference,
    vignette,
    fringe,
    glare,
    color,
    reducedMotion,
  }
  const optsRef = useRef(opts)
  optsRef.current = opts
  const statusRef = useRef(onStatusChange)
  statusRef.current = onStatusChange

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    createCrtOverlay(canvas, optsRef.current).then((overlay) => {
      if (cancelled) {
        overlay?.destroy()
        return
      }
      overlayRef.current = overlay
      statusRef.current?.(overlay ? 'gpu' : 'unsupported')
    })
    return () => {
      cancelled = true
      overlayRef.current?.destroy()
      overlayRef.current = null
    }
  }, [])

  const key = JSON.stringify(opts)
  useEffect(() => {
    overlayRef.current?.update(optsRef.current)
  }, [key])

  return (
    <canvas
      ref={canvasRef}
      className={cx('rpk-crt-gpu', className)}
      style={style}
      aria-hidden="true"
    />
  )
}
