import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  CRTScreen,
  BootSequence,
  TypeWriter,
  Parchment,
  WaxSeal,
  Poster,
  MetalPlate,
  Dataslate,
  type CRTTheme,
  type ParchmentTone,
  type WaxColor,
  type MetalTone,
  type DataslateTone,
} from '../src'

const THEMES: CRTTheme[] = ['phosphor', 'amber', 'ice']
const PAPERS: ParchmentTone[] = ['vellum', 'folio', 'ash']
const WAX: WaxColor[] = ['crimson', 'gold', 'green', 'charcoal']
const METALS: MetalTone[] = ['iron', 'brass', 'gunmetal']
const SLATES: DataslateTone[] = ['imperial', 'union', 'amber']

type Family = 'crt' | 'analog'
type Toggle = 'scanlines' | 'flicker' | 'sweep' | 'vignette' | 'curvature'
const TOGGLES: Toggle[] = ['scanlines', 'flicker', 'sweep', 'vignette', 'curvature']

const BOOT_LINES = [
  { text: '> POST ............................ OK', status: 'ok' as const },
  { text: '> carregando rpg-prop-kit v0.2.0 ...', status: 'default' as const },
  { text: '> montando subsistema de video ... OK', status: 'ok' as const },
  { text: '> AVISO: fluxo de antiprotons instavel', status: 'error' as const },
  { text: '> (use a barra acima para configurar a tela)', status: 'muted' as const },
]

function Playground() {
  const [family, setFamily] = useState<Family>('crt')
  const [theme, setTheme] = useState<CRTTheme>('phosphor')
  const [paper, setPaper] = useState<ParchmentTone>('vellum')
  const [wax, setWax] = useState<WaxColor>('crimson')
  const [metal, setMetal] = useState<MetalTone>('iron')
  const [slate, setSlate] = useState<DataslateTone>('imperial')
  const [fx, setFx] = useState<Record<Toggle, boolean>>({
    scanlines: true,
    flicker: true,
    sweep: true,
    vignette: true,
    curvature: true,
  })
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
          familia:{' '}
          <select value={family} onChange={(e) => setFamily(e.target.value as Family)}>
            <option value="crt">crt</option>
            <option value="analog">analog</option>
          </select>
        </label>

        {family === 'crt' && (
          <>
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
          </>
        )}

        {family === 'analog' && (
          <>
            <label>
              papel:{' '}
              <select
                value={paper}
                onChange={(e) => setPaper(e.target.value as ParchmentTone)}
              >
                {PAPERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              cera:{' '}
              <select value={wax} onChange={(e) => setWax(e.target.value as WaxColor)}>
                {WAX.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              metal:{' '}
              <select value={metal} onChange={(e) => setMetal(e.target.value as MetalTone)}>
                {METALS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              slate:{' '}
              <select
                value={slate}
                onChange={(e) => setSlate(e.target.value as DataslateTone)}
              >
                {SLATES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      </header>

      {family === 'crt' ? (
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
      ) : (
        <div
          style={{
            overflow: 'auto',
            padding: 24,
            background: '#1a1410',
            display: 'grid',
            gap: 28,
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignContent: 'start',
          }}
        >
          <Parchment tone={paper} ruled stained>
            <p style={{ marginTop: 0 }}>
              Vigia de Pedravale — o sino silenciou na terceira vela. A muralha
              leste ainda segura, mas a Fenda avança um passo a cada inverno.
            </p>
            <p style={{ marginBottom: 0, textAlign: 'right' }}>— Lyra</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <WaxSeal glyph="P" color={wax} motto="vigilia" size={88} />
            </div>
          </Parchment>

          <Poster
            eyebrow="aviso"
            title="A Fenda"
            footer="afixado na muralha · inverno do 12º ano"
          >
            Não cruzar o fosso após o sino. Quem voltar marcado não entra.
          </Poster>

          <MetalPlate tone={metal}>setor 7-g · acesso restrito</MetalPlate>

          <Dataslate tone={slate}>
            {'// Union Administrative Notice //'}
            <br />
            Prioridade verde. Lance autorizada. Não engajar ativos SecComm.
          </Dataslate>
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
)
