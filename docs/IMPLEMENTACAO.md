# Documentacao de Implementacao

## 1. Visao geral

Este projeto e uma plataforma de estudos para assuntos de informatica, desenhada para cobrir integralmente a ementa presente em [ementa.md](/home/guilherme/Projetos/gkdev/ementa.md). A proposta arquitetural separa:

- `frontend/` em Angular para a experiencia principal do aluno e administracao.
- `backend/` em Next.js para API, autenticacao, processamento de conteudo, servicos de estudo e camadas server-side.

Essa divisao facilita deploy separado na Hostinger, onde Angular funciona melhor como site estatico e Next.js como aplicacao Node.js.

## 2. Objetivos do produto

O produto deve permitir:

- Organizar todo o conteudo da ementa por macroarea, modulo, topico e aula.
- Publicar textos, resumos, mapas mentais, flashcards e questoes.
- Criar simulados por assunto, banca, dificuldade e peso.
- Registrar progresso do aluno por trilha, modulo e tema.
- Gerar revisoes programadas e recomendacoes de estudo.
- Oferecer painel administrativo para cadastrar conteudo e acompanhar desempenho.
- Disponibilizar busca global por conceitos, termos tecnicos e assuntos da ementa.

## 3. Estrutura recomendada do repositorio

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

## 4. Responsabilidade de cada aplicacao

### Frontend Angular

Responsavel por:

- Autenticacao do usuario.
- Dashboard do aluno.
- Navegacao por trilhas e modulos.
- Leitura de aulas e resumos.
- Resolucao de questoes e simulados.
- Visualizacao de desempenho.
- Painel administrativo de conteudo.

### Backend Next.js

Responsavel por:

- API HTTP.
- Regras de negocio.
- Emissao e validacao de sessao.
- Persistencia e acesso a banco.
- Indexacao de conteudo.
- Agendamento de revisoes e recomendacoes.
- Entrega de dados para frontend e integracoes externas.

## 5. Mapeamento da ementa para o produto

A ementa pode virar a taxonomia principal da plataforma.

### Macroareas

1. Infraestrutura de TI
2. Engenharia de Dados
3. Engenharia de Software
4. Seguranca da Informacao
5. Computacao em Nuvem
6. Inteligencia Artificial
7. Contratacoes de TI
8. Gestao de Tecnologia da Informacao

### Estrutura pedagogica sugerida

- Macroarea
- Modulo
- Unidade
- Aula
- Questao
- Simulado
- Revisao

### Exemplo de decomposicao

#### Infraestrutura de TI

- Arquitetura de infraestrutura
- Redes e comunicacao de dados
- Sistemas operacionais e servidores
- Armazenamento e backup
- Seguranca de infraestrutura
- Monitoramento, gestao e automacao
- Alta disponibilidade e recuperacao de desastres

#### Engenharia de Dados

- Bancos relacionais e nao relacionais
- Arquitetura de BI
- Integracao com fontes de dados
- ETL e pipelines
- Governanca e qualidade
- Integracao com nuvem

#### Engenharia de Software

- Arquitetura de software
- Design e programacao
- APIs e integracoes
- Persistencia
- DevOps e CI/CD
- Testes e qualidade
- Java
- Desenvolvimento seguro

#### Seguranca da Informacao

- IAM, SSO, SAML, OAuth2 e OIDC
- Privacidade e seguranca por padrao
- Malware
- Seguranca para web e web services
- MFA
- Solucoes de seguranca
- Frameworks de seguranca
- Tratamento de incidentes
- Criptografia
- Seguranca em nuvem e containers
- Ataques de rede e aplicacao

#### Computacao em Nuvem

- Fundamentos
- AWS, Azure e GCP
- Arquitetura em nuvem
- Redes e seguranca em nuvem
- DevOps e IaC
- Governanca, compliance e custos
- Armazenamento e processamento
- Migracao e modernizacao
- Multicloud
- Normativos do governo federal

#### Inteligencia Artificial

- Machine Learning
- Redes neurais e deep learning
- NLP e agentes
- IA generativa
- MLOps
- Etica e responsabilidade

#### Contratacoes de TI

- Etapas da contratacao
- Tipos de solucoes e servicos
- Governanca e fiscalizacao
- Riscos e controles
- Aspectos tecnicos e estrategicos
- Legislacao e normativos

#### Gestao de TI

- ITIL v4
- COBIT 5
- Metodologias ageis

## 6. Funcionalidades principais

### Para alunos

- Cadastro e login.
- Dashboard com progresso.
- Lista de trilhas por macroarea.
- Plano de estudo semanal.
- Aulas em texto estruturado.
- Questoes comentadas.
- Simulados temporizados.
- Favoritos e marcacoes.
- Revisao espaçada.
- Busca por termos e assuntos.

### Para administradores

- Cadastro de macroareas, modulos e aulas.
- Edicao de conteudo rico em markdown.
- Cadastro de questoes e gabaritos.
- Cadastro de simulados.
- Publicacao por versao.
- Relatorios de desempenho por assunto.

### Para a operacao

- Importacao de conteudo por arquivos.
- Versionamento de aulas.
- Auditoria de alteracoes.
- Logs de uso.
- Observabilidade.

## 7. Arquitetura de alto nivel

```text
Angular SPA
  -> consome API HTTPS
Next.js
  -> rotas API /app/api
  -> servicos de dominio
  -> ORM / acesso a banco
Banco de dados
  -> usuarios, conteudo, progresso, questoes, simulados
Armazenamento de arquivos
  -> imagens, anexos, materiais complementares
```

## 8. Stack recomendada

### Frontend

- Angular 19
- Angular Router
- Angular Forms
- RxJS
- Tailwind CSS ou Angular Material
- NgRx apenas se o estado ficar realmente complexo

### Backend

- Next.js 15 com App Router
- Route Handlers para a API
- NextAuth ou autenticacao custom com JWT e refresh token
- Prisma como ORM
- PostgreSQL como banco principal
- Zod para validacao

### Infra complementar

- Redis para cache e filas leves
- Meilisearch ou Elasticsearch para busca
- S3 compativel para arquivos e anexos
- GitHub Actions para CI/CD

## 9. Estrutura interna sugerida

### Frontend Angular

```text
frontend/src/app/
  core/
    guards/
    interceptors/
    services/
  shared/
    components/
    pipes/
    directives/
  features/
    auth/
    dashboard/
    trilhas/
    aulas/
    questoes/
    simulados/
    revisoes/
    admin/
```

### Backend Next.js

```text
backend/app/
  api/
    auth/
    trilhas/
    aulas/
    questoes/
    simulados/
    progresso/
    admin/
backend/src/
  domain/
  application/
  infrastructure/
  lib/
  validators/
```

## 10. Modelo funcional das paginas

### Frontend

- `/login`
- `/cadastro`
- `/dashboard`
- `/trilhas`
- `/trilhas/:slug`
- `/aulas/:slug`
- `/questoes`
- `/simulados`
- `/revisoes`
- `/perfil`
- `/admin`
- `/admin/conteudos`
- `/admin/questoes`
- `/admin/simulados`

### Backend

- `/`
- `/api/health`
- `/api/auth/*`
- `/api/trilhas`
- `/api/trilhas/[slug]`
- `/api/aulas/[slug]`
- `/api/questoes`
- `/api/simulados`
- `/api/progresso`
- `/api/admin/*`

## 11. Modelo de dados sugerido

### Entidades principais

- `User`
- `Role`
- `StudyTrack`
- `Module`
- `Lesson`
- `LessonVersion`
- `Question`
- `QuestionOption`
- `Simulation`
- `SimulationQuestion`
- `Answer`
- `StudyPlan`
- `ReviewTask`
- `Progress`
- `Tag`

### Relacionamentos principais

- Um `StudyTrack` possui varios `Module`.
- Um `Module` possui varias `Lesson`.
- Uma `Lesson` pode ter varias `LessonVersion`.
- Uma `Lesson` pode possuir varias `Question`.
- Um `Simulation` agrega varias `Question`.
- Um `User` possui `Progress`, `Answer`, `StudyPlan` e `ReviewTask`.

### Campos essenciais

#### User

- `id`
- `name`
- `email`
- `passwordHash`
- `role`
- `createdAt`

#### StudyTrack

- `id`
- `title`
- `slug`
- `description`
- `area`
- `order`

#### Module

- `id`
- `trackId`
- `title`
- `slug`
- `description`
- `order`

#### Lesson

- `id`
- `moduleId`
- `title`
- `slug`
- `summary`
- `content`
- `difficulty`
- `estimatedMinutes`
- `published`

#### Question

- `id`
- `lessonId`
- `statement`
- `explanation`
- `type`
- `difficulty`
- `source`

#### Progress

- `id`
- `userId`
- `lessonId`
- `status`
- `completionPercent`
- `lastAccessAt`

## 12. API inicial recomendada

### Autenticacao

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Catalogo de estudo

- `GET /api/trilhas`
- `GET /api/trilhas/:slug`
- `GET /api/modulos/:slug`
- `GET /api/aulas/:slug`
- `GET /api/busca?q=`

### Questoes e simulados

- `GET /api/questoes`
- `POST /api/questoes/responder`
- `GET /api/simulados`
- `POST /api/simulados/:id/iniciar`
- `POST /api/simulados/:id/finalizar`

### Progresso

- `GET /api/progresso`
- `POST /api/progresso/aulas/:id`
- `GET /api/revisoes`

### Administracao

- `POST /api/admin/trilhas`
- `POST /api/admin/modulos`
- `POST /api/admin/aulas`
- `POST /api/admin/questoes`
- `POST /api/admin/simulados`
- `PUT /api/admin/aulas/:id`
- `DELETE /api/admin/aulas/:id`

## 13. Fluxos criticos

### Fluxo do aluno

1. Usuario cria conta ou faz login.
2. Escolhe uma trilha.
3. Consome aulas e resolve questoes.
4. Sistema registra progresso.
5. Sistema agenda revisoes.
6. Usuario acompanha desempenho no dashboard.

### Fluxo do administrador

1. Admin cria macroarea.
2. Cadastra modulos e aulas.
3. Associa questoes por aula.
4. Publica simulado.
5. Acompanha uso e desempenho.

## 14. Estrategia de conteudo

Como a ementa e extensa, o conteudo deve ser modelado como dados e nao como paginas soltas.

### Recomendacao

- Cada macroarea vira uma trilha.
- Cada item numerado vira um modulo.
- Cada subitem vira uma aula ou subconjunto de aulas.
- Cada aula deve ter:
  - resumo
  - teoria completa
  - exemplos
  - mapa de termos
  - questoes associadas
  - palavras-chave

## 15. Roadmap tecnico

### Fase 1

- Estruturar monorepo.
- Gerar projeto Angular.
- Gerar projeto Next.js.
- Configurar TypeScript, lint e formatacao.
- Configurar banco PostgreSQL.
- Modelar entidades principais.

### Fase 2

- Implementar autenticacao.
- Implementar catalogo de trilhas.
- Implementar modulo de aulas.
- Implementar questoes e respostas.
- Implementar dashboard de progresso.

### Fase 3

- Implementar simulados.
- Implementar revisao espacada.
- Implementar busca.
- Implementar painel administrativo.
- Implementar analytics.

### Fase 4

- Observabilidade.
- Cache.
- Hardening.
- CI/CD.
- Deploy em producao.

## 16. Deploy na Hostinger

### Estrategia recomendada

Deploy separado por pasta e por aplicacao:

- `frontend/` -> build estatico Angular
- `backend/` -> app Node.js com Next.js

### Exemplo de publicacao

- `frontend` em `app.seudominio.com`
- `backend` em `api.seudominio.com`

### Frontend Angular na Hostinger

Fluxo:

1. Rodar `npm install`.
2. Rodar `npm run build` dentro de `frontend/`.
3. Publicar a pasta gerada em `dist/frontend/browser` ou equivalente.

### Backend Next.js na Hostinger

Fluxo:

1. Rodar `npm install`.
2. Rodar `npm run build` dentro de `backend/`.
3. Configurar app Node.js apontando para `npm run start`.
4. Configurar variaveis de ambiente no painel.

### Variaveis de ambiente minimas

- `DATABASE_URL`
- `NEXTAUTH_URL` ou equivalente
- `NEXTAUTH_SECRET`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `STORAGE_BUCKET`
- `STORAGE_REGION`
- `STORAGE_ACCESS_KEY`
- `STORAGE_SECRET_KEY`

## 17. Scripts iniciais esperados

### Raiz

```bash
npm install
npm run dev:frontend
npm run dev:backend
```

### Frontend

```bash
cd frontend
npx @angular/cli@latest new . --standalone --routing --style=scss --skip-git
```

### Backend

```bash
cd backend
npx create-next-app@latest . --ts --app --eslint --src-dir --import-alias "@/*"
```

Observacao: como os scaffolds sobrescrevem arquivos, o ideal e executar os comandos em uma branch dedicada ou adaptar a estrutura antes da geracao.

## 18. Qualidade e seguranca

### Qualidade

- ESLint
- Prettier
- Husky
- testes unitarios
- testes de integracao

### Seguranca

- senhas com hash forte
- MFA opcional
- rate limit
- validacao de payload
- autorizacao por papeis
- logs de auditoria
- protecao contra XSS, CSRF e brute force

## 19. CI/CD recomendado

### Pipeline

1. Instalar dependencias.
2. Rodar lint.
3. Rodar testes.
4. Rodar build do Angular.
5. Rodar build do Next.js.
6. Publicar artefatos.

### GitHub Actions

Separar jobs por aplicacao:

- `frontend-ci.yml`
- `backend-ci.yml`
- `deploy-frontend.yml`
- `deploy-backend.yml`

## 20. Backlog funcional inicial

### MVP

- Login
- Dashboard
- Navegacao por ementa
- Aulas
- Questoes comentadas
- Progresso

### Pos-MVP

- Simulados adaptativos
- Flashcards
- Revisao espacada
- Ranking
- Recomendacao de estudo com IA

## 21. Decisoes tecnicas recomendadas

- Usar Angular para a experiencia rica do aluno e admin.
- Usar Next.js como backend BFF e API principal.
- Manter conteudo versionado no banco e opcionalmente em markdown importado.
- Centralizar taxonomia da ementa no banco para nao acoplar a navegacao ao codigo.
- Fazer deploy separado na Hostinger para reduzir acoplamento operacional.

## 22. Proximos passos praticos

1. Gerar o scaffold real do Angular em `frontend/`.
2. Gerar o scaffold real do Next.js em `backend/`.
3. Criar o schema inicial do banco.
4. Implementar autenticacao.
5. Implementar cadastro de trilhas e aulas a partir da ementa.
6. Construir dashboard e modulo de progresso.

---

## 23. Estado atual da implementacao (abril 2026)

Esta seção documenta o que foi **efetivamente implementado** no projeto até o momento,
substituindo o estado planejado das seções anteriores.

### 23.1 Autenticação — migração de Django para Keycloak

O fluxo de autenticação foi completamente reescrito. O projeto não usa mais o backend
Django em `cemos2028.com`. Toda autenticação passa pelo Keycloak da plataforma Spring.

**Arquitetura de autenticação atual:**

```
Angular (frontend)
    │  POST /api/auth/login  { username, password }
    ▼
Next.js backend (BFF)
    │  POST /realms/login-integrado/protocol/openid-connect/token
    │  grant_type=password  (Direct Access Grant)
    ▼
Keycloak (:8180)
    └── realm: login-integrado
    └── client: cemos-auth-gateway
    └── Retorna: access_token (JWT, 5 min) + refresh_token (cookie httpOnly)
```

**Arquivos criados/alterados no backend Next.js (`backend/`):**

| Arquivo | O que faz |
|---------|-----------|
| `lib/keycloak-auth.js` | Centraliza todas as chamadas ao Keycloak: `keycloakLogin`, `keycloakRefresh`, `keycloakLogout`, `buildUserFromPayload` |
| `app/api/auth/login/route.js` | Direct Access Grant; retorna `{ accessToken, expiresIn, user }`; armazena `refresh_token` em cookie `httpOnly` |
| `app/api/auth/refresh/route.js` | Lê o cookie `refresh_token`; chama Keycloak para renovar; faz rotate do refresh token |
| `app/api/auth/logout/route.js` | Invalida sessão no Keycloak (`/logout`); limpa o cookie |
| `app/api/auth/me/route.js` | Decodifica o Bearer JWT; retorna campos Keycloak: `sub`, `preferred_username`, `email`, `name`, `roles` |
| `app/api/auth/register/route.js` | Removida referência ao Django; retorna 501 orientando ao Keycloak |
| `.env.example` | Atualizado com `KEYCLOAK_*`, `CORS_ORIGIN`, `MONGODB_URI` |

**Formato da resposta de login:**

```json
{
  "accessToken": "eyJhbGci...",
  "expiresIn": 300,
  "user": {
    "sub": "uuid-keycloak",
    "username": "admin",
    "email": "admin@cemos2028.com",
    "name": "Administrador Plataforma",
    "roles": ["ADMIN"]
  }
}
```

O `refresh_token` **não aparece no body** — é armazenado como cookie `httpOnly; SameSite=Lax`
e enviado automaticamente pelo browser nas chamadas subsequentes a `/api/auth/refresh`.

**Roles disponíveis no realm `login-integrado`:**

| Role | Permissão |
|------|-----------|
| `ADMIN` | Acesso total |
| `EDITOR` | Criar e editar conteúdo |
| `APROVADOR` | Aprovar conteúdo |
| `CONSULTA` | Somente leitura |
| `AUDITOR` | Auditoria |

---

### 23.2 Frontend Angular — mudanças no fluxo de autenticação

**Arquivos alterados em `frontend/src/`:**

| Arquivo | Mudança |
|---------|---------|
| `core/services/cemos-auth.service.ts` | Novas interfaces `AuthUser` e `LoginResponse`; chamadas para `/api/auth/*` (proxy local) com `withCredentials: true` |
| `core/services/session.service.ts` | Usa `AuthUser` (sem `refreshToken` em memória); novo método `hasRole(role: string)` |
| `core/interceptors/auth-token.interceptor.ts` | Paths ignorados atualizados: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout` |
| `features/auth/pages/login-page.component.ts` | Remove `onTestIntegration()` (específico do Django); adiciona `onLogout()` com invalidação remota |
| `proxy.conf.json` *(novo)* | Proxy de desenvolvimento: `/api → http://localhost:3001` |
| `angular.json` | Adicionado `"proxyConfig": "proxy.conf.json"` no `serve.options` |

**Interfaces TypeScript atuais:**

```typescript
export interface AuthUser {
  sub: string;           // UUID do Keycloak
  username: string;      // preferred_username
  email: string;
  name: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser | null;
}
```

**Fluxo do refresh token:**

O cookie `refresh_token` (httpOnly) é enviado automaticamente quando o Angular chama
`POST /api/auth/refresh`. O Next.js lê o cookie, chama o Keycloak, e retorna um novo
`accessToken` para o Angular armazenar em memória.

---

### 23.3 MongoDB — API de Áreas de Conhecimento

A coleção `areas` no MongoDB armazena o conteúdo dinâmico das áreas, subáreas e
ferramentas com texto em Markdown. Essa API é exposta **tanto pelo Next.js (gkdev)**
quanto pelo **Spring Boot (módulo `ti`)**.

**Estrutura do documento MongoDB (coleção `gkdev.areas`):**

```json
{
  "_id": "ObjectId(...)",
  "slug": "infraestrutura-ti",
  "title": "Infraestrutura de TI",
  "description": "Descrição da área...",
  "subareas": [
    { "slug": "redes-e-comunicacao", "nome": "Redes e comunicação de dados", "conteudo": "# Redes...(Markdown)" }
  ],
  "ferramentas": [
    { "slug": "linux", "nome": "Linux", "conteudo": "# Linux...(Markdown)" }
  ],
  "materiais": [
    { "title": "Roteiro: Arquitetura", "url": "/roteiros/arquitetura.md" }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Endpoints disponíveis (Next.js em `/api/areas`):**

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/areas` | Público | Lista todas as áreas |
| `GET` | `/api/areas/:slug` | Público | Retorna uma área completa |
| `PUT` | `/api/areas/:slug` | ADMIN ou EDITOR | Cria ou atualiza área completa (upsert) |
| `PATCH` | `/api/areas/:slug/subareas/:subareaSlug` | ADMIN ou EDITOR | Atualiza o `conteudo` Markdown de uma subárea |
| `PATCH` | `/api/areas/:slug/ferramentas/:ferramentaSlug` | ADMIN ou EDITOR | Atualiza o `conteudo` Markdown de uma ferramenta |

Os mesmos endpoints também são expostos pelo **Spring Boot** no módulo `ti`
(`/home/guilherme/Projetos/java/spring/modules/ti/`), compartilhando a mesma
coleção MongoDB. Ver documentação em `modules/ti/API-AREAS-MONGODB.md`.

---

### 23.4 Proxy de desenvolvimento

Em desenvolvimento o Angular não chama a API diretamente via URL absoluta.
O `ng serve` usa `proxy.conf.json` para redirecionar:

```
Angular :4200  /api/*  →  Next.js :3001  /api/*
```

Para iniciar em desenvolvimento:

```bash
# Terminal 1 — Keycloak + MongoDB (via docker-compose da plataforma Spring)
cd /home/guilherme/Projetos/java/spring
docker compose up -d mongodb keycloak db

# Terminal 2 — Next.js backend (gkdev)
cd /home/guilherme/Projetos/gkdev/backend
cp .env.example .env.local
# Edite .env.local com KEYCLOAK_CLIENT_SECRET do .env da plataforma Spring
PORT=3001 npm run dev

# Terminal 3 — Angular frontend (gkdev)
cd /home/guilherme/Projetos/gkdev/frontend
npm run dev  # ou: ng serve
```

---

### 23.5 Configuração de ambiente necessária

Antes de rodar o projeto, crie `backend/.env.local` a partir do `.env.example`:

```env
KEYCLOAK_URL=http://localhost:8180
KEYCLOAK_REALM=login-integrado
KEYCLOAK_CLIENT_ID=cemos-auth-gateway
KEYCLOAK_CLIENT_SECRET=<valor de KEYCLOAK_GATEWAY_CLIENT_SECRET no .env do Spring>

CORS_ORIGIN=http://localhost:4200

MONGODB_URI=mongodb://gkdev:gkdev_secret@localhost:27017/gkdev?authSource=admin
```

O `KEYCLOAK_CLIENT_SECRET` está em:
`/home/guilherme/Projetos/java/spring/.env` → variável `KEYCLOAK_GATEWAY_CLIENT_SECRET`

---

### 23.6 O que ainda não foi implementado

| Funcionalidade | Status |
|----------------|--------|
| Tela de login Angular conectada ao Next.js (HTML/SCSS) | Lógica pronta, template pendente |
| Renovação automática do access token no interceptor | Pendente |
| Guard de rotas por role no Angular | Pendente |
| Seed inicial das áreas no MongoDB | Script JS disponível em `mongodb-areas-implementation.md` |
| Deploy da API Next.js no Hostinger | Ver `HOSTINGER_SITES.md` |
| Demais módulos: questões, simulados, progresso | Fase 2/3 do roadmap |
