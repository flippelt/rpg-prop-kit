// Ponto de entrada do pacote. Importa os temas para que eles entrem no CSS
// empacotado (rpg-prop-kit.css). Em seguida, reexporta a API pública.
import './styles/themes.css'

export { CRTScreen } from './components/CRTScreen'
export type { CRTScreenProps, CRTTheme } from './components/CRTScreen'
