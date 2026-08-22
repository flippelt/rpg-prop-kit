# rpg-prop-kit

[![CI](https://github.com/flippelt/rpg-prop-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/flippelt/rpg-prop-kit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/rpg-prop-kit?logo=npm)](https://www.npmjs.com/package/rpg-prop-kit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/rpg-prop-kit)](https://bundlephobia.com/package/rpg-prop-kit)
[![license](https://img.shields.io/npm/l/rpg-prop-kit)](./LICENSE)

Props de UI para ferramentas de RPG de mesa — CRT retrô **e** analógicos
(pergaminho, lacre de cera, cartaz, placa de metal, dataslate). Os CRTs
nascem do [Immersive Terminal for RPGs](https://github.com/flippelt/Immersive-Terminal-for-RPGs);
o resto é a mesma linguagem visual para handouts de fantasia e sci-fi.

> ⚠️ **Status:** `v0.2.0`. API ainda pode mudar na linha 0.x.

## Componentes

| Componente       | Descrição                                                        |
| ---------------- | ---------------------------------------------------------------- |
| `<CRTScreen>`    | Moldura de monitor CRT (scanlines, flicker, sweep, vignette, curvatura), com temas de fósforo. |
| `<TypeWriter>`   | Digita um texto caractere a caractere, com cursor piscando.      |
| `<BootSequence>` | Sequência de boot: linhas digitadas em ordem, com cores por status. |
| `<CRTImage>`     | Imagem com tratamento de fósforo (dessaturada, tom + scanlines). |
| `<Parchment>`    | Folha de papel quente (`vellum` / `folio` / `ash`), opcionalmente pautada e manchada. |
| `<WaxSeal>`      | Gota de cera irregular + glifo (`crimson` / `gold` / `green` / `charcoal`). |
| `<Poster>`       | Cartaz de aviso / procurado (moldura dupla, título em caixa alta). |
| `<MetalPlate>`   | Placa escovada com rebites (`iron` / `brass` / `gunmetal`). |
| `<Dataslate>`    | Tablete sci-fi (`imperial` / `union` / `amber`) com LCD e scanlines. |

Hook: `useTypewriter(text, options)` — a lógica de digitação, caso queira montar o seu próprio componente.

As classes CSS (`rpk-parchment`, `rpk-seal`, `rpk-poster`, `rpk-plate`,
`rpk-slate`) funcionam sozinhas se você só importar `rpg-prop-kit/styles.css`
— os componentes React só aplicam as classes e as paletas via `data-rpk-*`.

_Mais props chegam nas próximas versões._

## Instalação

```bash
npm install rpg-prop-kit
```

`react` e `react-dom` (>= 18) são peer dependencies.

## Uso

```tsx
import { CRTScreen, BootSequence, TypeWriter } from 'rpg-prop-kit'
import 'rpg-prop-kit/styles.css'

export function App() {
  return (
    <CRTScreen theme="phosphor" fullscreen>
      <BootSequence
        lines={[
          { text: '> POST ......... OK', status: 'ok' },
          '> carregando manifesto da missao ...',
          { text: '> AVISO: assinatura desconhecida', status: 'error' },
        ]}
      />
      <TypeWriter text="> bem-vindo, operador._" cursor />
    </CRTScreen>
  )
}
```

```tsx
import { Parchment, WaxSeal, Poster, Dataslate } from 'rpg-prop-kit'
import 'rpg-prop-kit/styles.css'

export function Handouts() {
  return (
    <>
      <Parchment tone="vellum" stained>
        <p>O sino silenciou na terceira vela.</p>
        <WaxSeal glyph="P" color="crimson" motto="vigilia" />
      </Parchment>
      <Poster eyebrow="aviso" title="A Fenda">
        Não cruzar o fosso após o sino.
      </Poster>
      <Dataslate tone="union">Prioridade verde. Lance autorizada.</Dataslate>
    </>
  )
}
```

### Props do `CRTScreen`

| Prop         | Tipo                              | Padrão     | Descrição                                   |
| ------------ | --------------------------------- | ---------- | ------------------------------------------- |
| `theme`      | `'phosphor' \| 'amber' \| 'ice'`  | —          | Tema de cor. Omita para usar o seu próprio. |
| `fullscreen` | `boolean`                         | `false`    | Ocupa a viewport inteira.                   |
| `scanlines`  | `boolean`                         | `true`     | Linhas horizontais.                         |
| `flicker`    | `boolean`                         | `true`     | Tremor de opacidade.                        |
| `sweep`      | `boolean`                         | `true`     | Faixa de luz descendo.                      |
| `vignette`   | `boolean`                         | `true`     | Bordas escurecidas.                         |
| `curvature`  | `boolean`                         | `true`     | Leve inclinação 3D.                         |
| `className`  | `string`                          | —          | Classe extra no container.                  |
| `style`      | `CSSProperties`                   | —          | Estilos inline no container.                |

### Tema próprio

Não passe `theme` e defina as variáveis num ancestral:

```css
.minha-tela {
  --rpk-bg: #08010a;
  --rpk-fg: #d36bff;
  --rpk-accent: #f0b3ff;
  --rpk-glow: 8px;
}
```

## Desenvolvimento

```bash
npm install      # instala as dependências
npm run dev      # playground em http://localhost:5173
npm run build    # gera o pacote em dist/ (ES + UMD + tipos)
npm test
```

Release no npm: tag `v*` dispara `.github/workflows/publish.yml` (OIDC, sem
`NPM_TOKEN`). Trusted publisher no npmjs.com aponta para este repo e o
arquivo `publish.yml`.

A estrutura:

```
src/
  components/   # um diretório por componente (CRTScreen, Parchment, ...)
  hooks/        # hooks reutilizáveis
  styles/       # temas CRT (`themes.css`) e paletas analógicas (`analog.css`)
  utils/        # helpers
examples/       # playground consumido pelo index.html da raiz
```

## Licença

[MIT](./LICENSE) © Felipe Lippelt
