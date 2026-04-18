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
- `npm run build:all`
- `npm run hostinger:site:prepare`
- `npm run hostinger:api:prepare`

## Deploy na Hostinger

- `frontend/` deve ser publicado como site estatico.
- `backend/` deve ser publicado como aplicacao Node.js.
- O ideal e deploy separado por pasta, subdominio ou servico.

Exemplo:

- `app.seudominio.com` -> Angular
- `api.seudominio.com` ou `www.seudominio.com` -> Next.js

## Publicacao em gkdevstudio.com (Hostinger Sites)

Para o dominio principal no Hostinger Sites, publique o frontend Angular como estatico:

1. Execute `npm run hostinger:site:prepare`.
2. O pacote final ficara em `dist/`.
3. Publique o conteudo dessa pasta em `public_html/`.

Automacao opcional:

- Workflow pronto em `.github/workflows/deploy-hostinger-site.yml`.
- Configure os secrets no GitHub:
  - `HOSTINGER_FTP_HOST`
  - `HOSTINGER_FTP_USER`
  - `HOSTINGER_FTP_PASSWORD`

Observacao: o backend Next.js deve rodar separado como app Node.js no Hostinger (idealmente em subdominio como `api.gkdevstudio.com`).

## Publicacao da API Next.js (Hostinger Node)

Para o backend Next.js em app Node separado:

1. Execute `npm run hostinger:api:prepare`.
2. O pacote final ficara em `deploy/hostinger/api/`.
3. Publique esse conteudo no app Node do Hostinger.
4. Entry file do app: `server.js`.

Alternativa pelo painel de build Hostinger (sem bundle pronto):

- Comando de construcao: `npm run build:backend`
- Diretorio de saida: `backend/.next`
- Arquivo de entrada: `backend/.next/standalone/backend/server.js`

## Observacao

Este repositorio foi preparado com a documentacao e a estrutura inicial. O scaffold completo de Angular e Next.js depende da instalacao das dependencias e da execucao dos CLIs.
