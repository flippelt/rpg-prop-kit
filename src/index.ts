// Ponto de entrada do pacote. Importa os temas para que eles entrem no CSS
// empacotado (rpg-prop-kit.css). Em seguida, reexporta a API pública.
import './styles/themes.css'
import './styles/analog.css'

export { CRTScreen } from './components/CRTScreen'
export type { CRTScreenProps, CRTTheme } from './components/CRTScreen'

export { TypeWriter } from './components/TypeWriter'
export type { TypeWriterProps } from './components/TypeWriter'

export { BootSequence } from './components/BootSequence'
export type { BootSequenceProps, BootLine, BootStatus } from './components/BootSequence'

export { CRTImage } from './components/CRTImage'
export type { CRTImageProps } from './components/CRTImage'

export { Parchment } from './components/Parchment'
export type { ParchmentProps, ParchmentTone } from './components/Parchment'

export { WaxSeal } from './components/WaxSeal'
export type { WaxSealProps, WaxColor, WaxVariant } from './components/WaxSeal'

export { Poster } from './components/Poster'
export type { PosterProps } from './components/Poster'

export { MetalPlate } from './components/MetalPlate'
export type { MetalPlateProps, MetalTone } from './components/MetalPlate'

export { Dataslate } from './components/Dataslate'
export type { DataslateProps, DataslateTone } from './components/Dataslate'

export { useTypewriter } from './hooks/useTypewriter'
export type { UseTypewriterOptions, UseTypewriterResult } from './hooks/useTypewriter'
