# Deploy no Hostinger Sites (gkdevstudio.com)

## Objetivo

Publicar o frontend Angular (`frontend/`) no domínio principal `gkdevstudio.com` usando Hostinger Sites.

## Estrategia recomendada

- `gkdevstudio.com` -> frontend estatico (Angular)
- `api.gkdevstudio.com` -> backend Node.js (Next.js) em app separado

## Preparar artefato estatico

Na raiz do repositorio:

```bash
npm run hostinger:site:prepare
```

Esse comando:

1. roda `build:frontend`
2. copia os arquivos de `frontend/dist/frontend/`
3. gera `dist/.htaccess` com fallback para SPA

## Publicacao manual

No Hostinger:

1. Abra o site `gkdevstudio.com`
2. Entre no Gerenciador de Arquivos ou FTP
3. Faça upload do conteúdo de `dist/` para `public_html/`

## Publicacao automatica por GitHub Actions

Workflow já incluído:

- `.github/workflows/deploy-hostinger-site.yml`

Configure os secrets no repositório GitHub:

- `HOSTINGER_FTP_HOST`
- `HOSTINGER_FTP_USER`
- `HOSTINGER_FTP_PASSWORD`

Ao fazer push na `main`, o deploy do frontend será executado automaticamente.

## Backend Next.js

O backend não deve ser publicado em `public_html`.

Execute como aplicação Node.js separada e aponte o frontend para a URL da API (ex.: `https://api.gkdevstudio.com`).
