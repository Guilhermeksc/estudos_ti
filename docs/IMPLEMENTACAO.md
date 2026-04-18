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
