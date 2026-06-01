# rpg-prop-kit

Props de UI retrô para ferramentas de RPG de mesa — componentes React prontos
para dar clima de "terminal de ficção científica" às suas mesas. Os componentes
nascem do efeito CRT do [Immersive Terminal for RPGs](https://github.com/flippelt/Immersive-Terminal-for-RPGs),
extraídos e empacotados para reuso em qualquer projeto.

> ⚠️ **Status:** em desenvolvimento inicial (`v0.1.0`). API pode mudar.

## Componentes

| Componente    | Descrição                                                        |
| ------------- | ---------------------------------------------------------------- |
| `<CRTScreen>` | Moldura de monitor CRT (scanlines, flicker, sweep, vignette, curvatura), com temas de fósforo. |

_Mais props chegam nas próximas versões._

## Instalação

```bash
npm install rpg-prop-kit
```

`react` e `react-dom` (>= 18) são peer dependencies.

## Uso

```tsx
import { CRTScreen } from 'rpg-prop-kit'
import 'rpg-prop-kit/styles.css'

export function App() {
  return (
    <CRTScreen theme="phosphor" fullscreen>
      <pre>{`> acesso concedido.\n> bem-vindo, operador._`}</pre>
    </CRTScreen>
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
```

A estrutura:

```
src/
  components/   # um diretório por componente (CRTScreen, ...)
  hooks/        # hooks reutilizáveis
  styles/       # temas e tokens compartilhados
  utils/        # helpers
examples/       # playground consumido pelo index.html da raiz
```

## Licença

[MIT](./LICENSE) © Felipe Lippelt
