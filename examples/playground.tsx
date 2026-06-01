import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  CRTScreen,
  BootSequence,
  TypeWriter,
  type CRTTheme,
} from '../src'

const THEMES: CRTTheme[] = ['phosphor', 'amber', 'ice']

type Toggle = 'scanlines' | 'flicker' | 'sweep' | 'vignette' | 'curvature'
const TOGGLES: Toggle[] = ['scanlines', 'flicker', 'sweep', 'vignette', 'curvature']

const BOOT_LINES = [
  { text: '> POST ............................ OK', status: 'ok' as const },
  { text: '> carregando rpg-prop-kit v0.1.0 ...', status: 'default' as const },
  { text: '> montando subsistema de video ... OK', status: 'ok' as const },
  { text: '> AVISO: fluxo de antiprotons instavel', status: 'error' as const },
  { text: '> (use a barra acima para configurar a tela)', status: 'muted' as const },
]

function Playground() {
  const [theme, setTheme] = useState<CRTTheme>('phosphor')
  const [fx, setFx] = useState<Record<Toggle, boolean>>({
    scanlines: true,
    flicker: true,
    sweep: true,
    vignette: true,
    curvature: true,
  })
  // chave para reiniciar a BootSequence ao clicar em "reboot"
  const [bootKey, setBootKey] = useState(0)
  const [bootDone, setBootDone] = useState(false)

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
        <strong>rpg-prop-kit</strong>

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

        <button
          onClick={() => {
            setBootDone(false)
            setBootKey((k) => k + 1)
          }}
        >
          reboot
        </button>
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
          <BootSequence
            key={bootKey}
            lines={BOOT_LINES}
            onDone={() => setBootDone(true)}
          />

          {bootDone && (
            <div style={{ marginTop: '1.5em' }}>
              <TypeWriter
                text={'> sistema pronto. bem-vindo, operador._'}
                speed={32}
                cursor
              />
            </div>
          )}
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
