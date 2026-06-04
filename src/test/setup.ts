import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// O jsdom não implementa matchMedia; sem isso o useTypewriter quebra ao
// consultar prefers-reduced-motion. Padrão: nenhuma media query casa
// (matches: false). Testes que precisam de reduce sobrescrevem este stub.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}

// Desmonta a árvore React entre os testes para evitar vazamento de estado/DOM.
afterEach(() => {
  cleanup()
})
