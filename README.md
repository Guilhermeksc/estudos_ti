# Plataforma de Estudos de Informatica

Monorepo base para uma plataforma de estudos focada em conteudos de informatica, com:

- `frontend/`: aplicacao Angular para a interface do aluno e painel administrativo.
- `backend/`: aplicacao Next.js para API, autenticacao, renderizacao institucional e servicos de conteudo.
- `docs/`: documentacao de arquitetura e implementacao.

## Estrutura

```text
repo/
  frontend/
    package.json
    angular.json
    src/
  backend/
    package.json
    next.config.js
    app/
  docs/
    IMPLEMENTACAO.md
  ementa.md
  package.json
```

## Objetivo do produto

Cobrir toda a ementa de `ementa.md` com uma plataforma organizada por trilhas, modulos, aulas, revisoes, questoes, simulados, progresso do aluno e analytics.

## Como usar este repositorio

1. Leia a documentacao principal em [docs/IMPLEMENTACAO.md](/home/guilherme/Projetos/gkdev/docs/IMPLEMENTACAO.md).
2. Gere o scaffold real do Angular dentro de `frontend/`.
3. Gere o scaffold real do Next.js dentro de `backend/`.
4. Conecte ambos ao mesmo banco e ao mesmo fluxo de autenticacao.

## Scripts do monorepo

Na raiz:

- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build:frontend`
- `npm run build:backend`

## Deploy na Hostinger

- `frontend/` deve ser publicado como site estatico.
- `backend/` deve ser publicado como aplicacao Node.js.
- O ideal e deploy separado por pasta, subdominio ou servico.

Exemplo:

- `app.seudominio.com` -> Angular
- `api.seudominio.com` ou `www.seudominio.com` -> Next.js

## Observacao

Este repositorio foi preparado com a documentacao e a estrutura inicial. O scaffold completo de Angular e Next.js depende da instalacao das dependencias e da execucao dos CLIs.
