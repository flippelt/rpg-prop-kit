import type { CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import './CRTImage.css'

export interface CRTImageProps {
  /** URL da imagem. */
  src: string
  /** Texto alternativo (obrigatório por acessibilidade). */
  alt: string
  /** Aplica o tom de fósforo por cima da imagem. Padrão: true. */
  tint?: boolean
  /** Sobrepõe scanlines. Padrão: true. */
  scanlines?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Exibe uma imagem com o tratamento de fósforo do CRT: dessaturada, com
 * contraste elevado, tom da cor de destaque e scanlines por cima — o efeito
 * de "foto no monitor" do Immersive Terminal.
 */
export function CRTImage({
  src,
  alt,
  tint = true,
  scanlines = true,
  className,
  style,
}: CRTImageProps) {
  return (
    <span
      className={cx(
        'rpk-crt-img',
        tint && 'rpk-crt-img--tint',
        scanlines && 'rpk-crt-img--scanlines',
        className,
      )}
      style={style}
    >
      <img className="rpk-crt-img__img" src={src} alt={alt} />
    </span>
  )
}
