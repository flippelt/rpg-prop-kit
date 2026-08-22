# Changelog

Todas as mudanças relevantes deste pacote são documentadas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

> ⚠️ **Alpha (0.x):** a API pública ainda pode mudar entre versões menores.
> Mudanças incompatíveis serão sempre listadas em **Alterado** ou **Removido**.

## [Não publicado]

### Adicionado

- Suíte de testes com Vitest + Testing Library (jsdom): `cx`, `useTypewriter`,
  `BootSequence` e `CRTScreen`.
- Scripts `test` e `test:watch`.
- Os testes agora rodam no CI e como gate do `prepublishOnly`.

### Alterado

- Vitest atualizado de 2.x para 4.x (ferramenta de dev), zerando as
  vulnerabilidades transitivas de `vite`/`esbuild`. Sem impacto no pacote
  publicado — afeta apenas o ambiente de testes.

## [0.2.0] - 2026-08-22

### Adicionado

- Família analógica: `Parchment`, `WaxSeal`, `Poster`, `MetalPlate`, `Dataslate`.
- Paletas em `src/styles/analog.css` (`data-rpk-parchment` / `wax` / `metal` /
  `slate`). As classes CSS funcionam sem React; os componentes só as aplicam.
- Playground: seletor `familia` (crt | analog).

## [0.1.0] - 2026-06-03

### Adicionado

- Versão inicial publicada no npm.
- Componentes `CRTScreen`, `TypeWriter`, `BootSequence` e `CRTImage`.
- Hook `useTypewriter`.
- Utilitário `cx` para composição de classes.
- Empacotamento em modo library (ES + UMD) com geração de tipos (`.d.ts`).
