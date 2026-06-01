import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CRTScreen, type CRTTheme } from '../src'

const THEMES: CRTTheme[] = ['phosphor', 'amber', 'ice']

type Toggle = 'scanlines' | 'flicker' | 'sweep' | 'vignette' | 'curvature'
const TOGGLES: Toggle[] = ['scanlines', 'flicker', 'sweep', 'vignette', 'curvature']

function Playground() {
  const [theme, setTheme] = useState<CRTTheme>('phosphor')
  const [fx, setFx] = useState<Record<Toggle, boolean>>({
    scanlines: true,
    flicker: true,
    sweep: true,
    vignette: true,
    curvature: true,
  })

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%' }}>
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
          padding: '10px 16px',
          background: '#0d0d0d',
          color: '#ccc',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 14,
        }}
      >
        <strong>rpg-prop-kit · CRTScreen</strong>

        <label>
          tema:{' '}
          <select value={theme} onChange={(e) => setTheme(e.target.value as CRTTheme)}>
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        {TOGGLES.map((key) => (
          <label key={key} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={fx[key]}
              onChange={(e) => setFx((prev) => ({ ...prev, [key]: e.target.checked }))}
            />
            {key}
          </label>
        ))}
      </header>

      <div style={{ position: 'relative' }}>
        <CRTScreen
          theme={theme}
          scanlines={fx.scanlines}
          flicker={fx.flicker}
          sweep={fx.sweep}
          vignette={fx.vignette}
          curvature={fx.curvature}
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`> SISTEMA INICIALIZADO
> carregando rpg-prop-kit v0.1.0 ...
> componente: <CRTScreen />

Olá, mestre. Este é o playground do kit.

Use a barra acima para trocar o tema e ligar/desligar
cada efeito do monitor. Tudo isto sai do mesmo componente
que você vai poder usar em outros projetos.

> _`}
          </pre>
        </CRTScreen>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
)
