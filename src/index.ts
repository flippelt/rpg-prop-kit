// Ponto de entrada do pacote. Importa os temas para que eles entrem no CSS
// empacotado (rpg-prop-kit.css). Em seguida, reexporta a API pública.
import './styles/themes.css'

export { CRTScreen } from './components/CRTScreen'
export type { CRTScreenProps, CRTTheme } from './components/CRTScreen'

export { TypeWriter } from './components/TypeWriter'
export type { TypeWriterProps } from './components/TypeWriter'

export { BootSequence } from './components/BootSequence'
export type { BootSequenceProps, BootLine, BootStatus } from './components/BootSequence'

export { CRTImage } from './components/CRTImage'
export type { CRTImageProps } from './components/CRTImage'

export { useTypewriter } from './hooks/useTypewriter'
export type { UseTypewriterOptions, UseTypewriterResult } from './hooks/useTypewriter'
