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

## [0.1.0] - 2026-06-03

### Adicionado

- Versão inicial publicada no npm.
- Componentes `CRTScreen`, `TypeWriter`, `BootSequence` e `CRTImage`.
- Hook `useTypewriter`.
- Utilitário `cx` para composição de classes.
- Empacotamento em modo library (ES + UMD) com geração de tipos (`.d.ts`).
