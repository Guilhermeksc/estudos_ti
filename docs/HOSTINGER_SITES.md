# Deploy no Hostinger — gkdevstudio.com

Guia completo para publicar o frontend Angular e o backend Next.js no Hostinger, incluindo configuração de variáveis de ambiente.

---

## Visão geral da arquitetura de produção

```
Usuário (navegador)
    │
    ├── gkdevstudio.com         → Angular (Site Estático — Hostinger Sites)
    │
    └── api.gkdevstudio.com     → Next.js (Node.js App — Hostinger)
              │
              ├── Keycloak      → cemos2028.com:8180  (realm login-integrado)
              └── MongoDB       → servidor VPS ou MongoDB Atlas
```

> O Angular é um site estático puro. Todas as chamadas `/api/*` vão para
> `api.gkdevstudio.com`, que é o Next.js rodando como Node.js no Hostinger.

---

## Parte 1 — Frontend Angular (Site Estático)

### 1.1 Gerar o build de produção

```bash
# Na raiz do monorepo
npm run hostinger:site:prepare
```

Esse script:
1. Roda `npm run build:frontend` (Angular com `outputPath: dist`)
2. Copia os arquivos de `frontend/dist/`
3. Gera `dist/.htaccess` com fallback para SPA Angular

O artefato final fica em `dist/`.

### 1.2 Publicar no Hostinger Sites

**Opção A — Upload manual pelo hPanel:**

1. Acesse o hPanel → `gkdevstudio.com` → **Gerenciador de Arquivos**
2. Navegue até `public_html/`
3. Faça upload de todo o conteúdo da pasta `dist/`
4. Confirme que `index.html` e o arquivo `.htaccess` estão na raiz de `public_html/`

**Opção B — Deploy automático por GitHub Actions:**

O workflow `.github/workflows/deploy-hostinger-site.yml` está pronto.

Configure os seguintes secrets no repositório GitHub:

| Secret                   | Onde encontrar no Hostinger         |
|--------------------------|-------------------------------------|
| `HOSTINGER_FTP_HOST`     | hPanel → FTP → Contas FTP → Host    |
| `HOSTINGER_FTP_USER`     | hPanel → FTP → Contas FTP → Usuário |
| `HOSTINGER_FTP_PASSWORD` | A senha que você definiu para o FTP |

Push na branch `main` aciona o deploy automático.

### 1.3 Variáveis de ambiente do Angular (build-time)

O Angular compila o código em estático — não existe `process.env` em tempo de execução no browser. Variáveis precisam ser injetadas **durante o build** via `environment.ts`.

Para apontar a URL da API de produção, edite:

`frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.gkdevstudio.com'
};
```

`frontend/src/environments/environment.ts` (dev):

```typescript
export const environment = {
  production: false,
  apiUrl: ''   // vazio = usa o proxy Angular (proxy.conf.json → localhost:3001)
};
```

> Em desenvolvimento o Angular usa o proxy (`proxy.conf.json`) para rotear
> `/api` para `localhost:3001`. Em produção, o `apiUrl` precisa ser configurado
> no serviço HTTP ou usar um rewrite no Hostinger Sites (ver 1.4).

### 1.4 Redirecionar `/api` para o Next.js no `.htaccess`

O `dist/.htaccess` já inclui o fallback SPA. Adicione um `ProxyPass` para
redirecionar as chamadas de API:

```apache
# Redireciona /api para o backend Node.js
RewriteRule ^api/(.*) https://api.gkdevstudio.com/api/$1 [P,L]

# SPA fallback para o Angular
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

> **Atenção:** `mod_proxy` pode não estar disponível em todos os planos
> Hostinger. Se não funcionar, configure o Angular para usar a URL absoluta
> `https://api.gkdevstudio.com` diretamente.

---

## Parte 2 — Backend Next.js (Node.js App)

### 2.1 Gerar o bundle de produção

```bash
# Na raiz do monorepo
npm run hostinger:api:prepare
```

Esse script gera `deploy/hostinger/api/` com:
- Build do Next.js em modo `standalone`
- Entry point: `server.js`

Alternativa manual:

```bash
cd backend
npm run build
```

O standalone fica em `backend/.next/standalone/`.

### 2.2 Publicar no Hostinger Node.js App

1. Acesse o hPanel → **Websites** → `api.gkdevstudio.com` → **Manage**
2. Vá em **Node.js** e configure:
   - **Node.js version:** 20.x (recomendado)
   - **Entry file:** `server.js`
   - **Application root:** onde você fez upload dos arquivos
3. Faça o upload dos arquivos de `deploy/hostinger/api/` via FTP ou Gerenciador de Arquivos

### 2.3 Variáveis de ambiente no Hostinger Node.js

O Hostinger permite configurar variáveis de ambiente para apps Node.js de **duas formas**:

---

#### Método A — Pelo hPanel (recomendado para produção)

1. Acesse o hPanel → `api.gkdevstudio.com` → **Manage** → **Node.js**
2. Clique em **Edit** ou **Environment Variables**
3. Adicione cada variável abaixo uma a uma:

| Variável                  | Valor de produção                                                              |
|---------------------------|--------------------------------------------------------------------------------|
| `NODE_ENV`                | `production`                                                                   |
| `KEYCLOAK_URL`            | `https://cemos2028.com` (ou o domínio onde o Keycloak está em produção)        |
| `KEYCLOAK_REALM`          | `login-integrado`                                                              |
| `KEYCLOAK_CLIENT_ID`      | `cemos-auth-gateway`                                                           |
| `KEYCLOAK_CLIENT_SECRET`  | *(valor de `KEYCLOAK_GATEWAY_CLIENT_SECRET` no `.env` da plataforma Spring)*   |
| `MONGODB_URI`             | `mongodb+srv://usuario:senha@cluster.mongodb.net/gkdev?retryWrites=true`       |
| `CORS_ORIGIN`             | `https://gkdevstudio.com,https://www.gkdevstudio.com`                          |

> **Sobre `KEYCLOAK_CLIENT_SECRET`:** o valor correto está no arquivo
> `.env` da plataforma Spring em `/home/guilherme/Projetos/java/spring/.env`
> na variável `KEYCLOAK_GATEWAY_CLIENT_SECRET`. Nunca commite esse valor.

---

#### Método B — Arquivo `.env` junto do bundle

Se o hPanel não tiver tela de variáveis, crie um `.env` dentro da pasta do
app no servidor:

```bash
# Conecte via SSH ao servidor Hostinger e navegue até o diretório do app
nano /home/u123456789/api.gkdevstudio.com/.env
```

Conteúdo do arquivo `.env` em produção:

```env
NODE_ENV=production

# Keycloak
KEYCLOAK_URL=https://cemos2028.com
KEYCLOAK_REALM=login-integrado
KEYCLOAK_CLIENT_ID=cemos-auth-gateway
KEYCLOAK_CLIENT_SECRET=COLE_O_SECRET_AQUI

# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/gkdev?retryWrites=true&w=majority

# CORS
CORS_ORIGIN=https://gkdevstudio.com,https://www.gkdevstudio.com
```

Após salvar, reinicie o app no hPanel.

---

#### Método C — Variável via `package.json` start script (último recurso)

Só use se os outros métodos não funcionarem:

```json
"scripts": {
  "start": "KEYCLOAK_URL=https://cemos2028.com node server.js"
}
```

> **Não recomendado** porque expõe variáveis sensíveis no repositório.

---

### 2.4 Verificar se o backend está no ar

```bash
curl https://api.gkdevstudio.com/api/health
# Esperado: { "status": "ok" }

curl https://api.gkdevstudio.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SENHA"}'
# Esperado: { "accessToken": "...", "expiresIn": 300, "user": {...} }
```

---

## Parte 3 — Configuração do Keycloak para o domínio de produção

O Keycloak precisa aceitar redirects e origens do domínio `gkdevstudio.com`.

No `realm-export.json` ou pelo painel do Keycloak (`http://cemos2028.com:8180`):

1. Acesse **Clients** → `cemos-auth-gateway` → **Settings**
2. Em **Valid redirect URIs**, confirme que está listado:
   - `https://gkdevstudio.com/*`
   - `https://www.gkdevstudio.com/*`
   - `https://api.gkdevstudio.com/*`
3. Em **Web origins**, confirme: `+` (ou liste os domínios explicitamente)
4. Salve e reinicie o Keycloak se necessário

Para produção, atualize `KEYCLOAK_GATEWAY_REDIRECT_URIS` no `.env` da plataforma Spring e rode novamente o `keycloak-realm-admin`:

```bash
docker compose up keycloak-realm-admin
```

---

## Parte 4 — Resumo das variáveis por ambiente

### Desenvolvimento local

| Variável                 | Valor dev                                                             |
|--------------------------|-----------------------------------------------------------------------|
| `KEYCLOAK_URL`           | `http://localhost:8180`                                               |
| `KEYCLOAK_REALM`         | `login-integrado`                                                     |
| `KEYCLOAK_CLIENT_ID`     | `cemos-auth-gateway`                                                  |
| `KEYCLOAK_CLIENT_SECRET` | Valor de `KEYCLOAK_GATEWAY_CLIENT_SECRET` do `.env` do Spring        |
| `MONGODB_URI`            | `mongodb://gkdev:gkdev_secret@localhost:27017/gkdev?authSource=admin` |
| `CORS_ORIGIN`            | `http://localhost:4200`                                               |

Para configurar localmente:

```bash
cp backend/.env.example backend/.env.local
# Edite .env.local com os valores do .env da plataforma Spring
```

### Produção (Hostinger)

| Variável                 | Valor produção                                                       |
|--------------------------|----------------------------------------------------------------------|
| `KEYCLOAK_URL`           | `https://cemos2028.com` (porta padrão HTTPS)                         |
| `KEYCLOAK_REALM`         | `login-integrado`                                                    |
| `KEYCLOAK_CLIENT_ID`     | `cemos-auth-gateway`                                                 |
| `KEYCLOAK_CLIENT_SECRET` | Secret real (não commitar)                                           |
| `MONGODB_URI`            | URI do MongoDB Atlas ou VPS                                          |
| `CORS_ORIGIN`            | `https://gkdevstudio.com,https://www.gkdevstudio.com`               |
| `NODE_ENV`               | `production`                                                         |

---

## Parte 5 — Checklist de deploy

### Frontend Angular

- [ ] Rode `npm run hostinger:site:prepare`
- [ ] Confirme que `dist/index.html` e `dist/.htaccess` existem
- [ ] Upload do conteúdo de `dist/` para `public_html/`
- [ ] Acesse `gkdevstudio.com` e confirme que a SPA carrega
- [ ] Confirme que a rota `/login` não retorna 404

### Backend Next.js

- [ ] Rode `npm run hostinger:api:prepare` ou `cd backend && npm run build`
- [ ] Upload dos arquivos para o diretório do app Node.js no Hostinger
- [ ] Configure todas as variáveis de ambiente listadas na Parte 3
- [ ] Reinicie o app no hPanel
- [ ] Teste `GET https://api.gkdevstudio.com/api/health` → `{ status: "ok" }`
- [ ] Teste `POST https://api.gkdevstudio.com/api/auth/login` com credenciais válidas

### Keycloak

- [ ] `cemos-auth-gateway` tem `gkdevstudio.com` nas redirect URIs
- [ ] `KEYCLOAK_GATEWAY_CLIENT_SECRET` é o mesmo no Spring `.env` e no `.env` do Hostinger
- [ ] O Keycloak está acessível na URL configurada em `KEYCLOAK_URL`
