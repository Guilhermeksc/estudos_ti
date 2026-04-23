# Implementação: MongoDB para Conteúdo Dinâmico das Áreas de Conhecimento

## Contexto

Atualmente o catálogo de áreas (`Infraestrutura de TI`, `Engenharia de Dados`, etc.) é um array estático em `frontend/src/app/features/knowledge/data/knowledge-catalog.ts`. O objetivo é persistir esse conteúdo no MongoDB, onde **cada subárea e cada ferramenta pode ter seu próprio texto em Markdown**, expô-lo via API REST no backend Next.js e consumir dinamicamente no frontend Angular.

---

## Arquitetura Alvo

```
Angular Frontend  →  Next.js Backend API  →  MongoDB
    (HTTP)              (/api/areas)          (gkdev.areas)
```

---

## 1. Modelo de Dados

### Estrutura de documento no MongoDB

Cada área vira um documento. Subáreas e ferramentas deixam de ser `string[]` e passam a ser **objetos** com `nome`, `slug` (para identificação) e `conteudo` (Markdown livre).

```json
{
  "_id": "ObjectId(...)",
  "slug": "infraestrutura-ti",
  "title": "Infraestrutura de TI",
  "description": "Arquitetura de infraestrutura, redes, servidores...",
  "subareas": [
    {
      "slug": "arquitetura-de-infraestrutura",
      "nome": "Arquitetura de infraestrutura de TI",
      "conteudo": "# Arquitetura de Infraestrutura\n\nTexto em Markdown..."
    },
    {
      "slug": "redes-e-comunicacao",
      "nome": "Redes e comunicação de dados",
      "conteudo": ""
    }
  ],
  "ferramentas": [
    {
      "slug": "linux",
      "nome": "Linux",
      "conteudo": "# Linux\n\nSistema operacional base para ambientes corporativos..."
    },
    {
      "slug": "nginx-haproxy",
      "nome": "Nginx/HAProxy",
      "conteudo": ""
    }
  ],
  "materiais": [
    { "title": "Tópico 1: Arquitetura", "url": "/roteiro_topico1.md" }
  ],
  "createdAt": "2026-04-21T...",
  "updatedAt": "2026-04-21T..."
}
```

### Por que objetos em vez de strings?

| Abordagem | Prós | Contras |
|-----------|------|---------|
| `subareas: string[]` | Simples | Sem espaço para conteúdo vinculado |
| `subareas: { slug, nome, conteudo }[]` | Conteúdo acoplado a cada item, sem índice externo | Estrutura ligeiramente maior |

A segunda abordagem elimina a necessidade de um mapa `conteudo` separado e torna o documento auto-descritivo.

---

## 2. Infraestrutura — MongoDB com Docker

```yaml
# docker-compose.yml (raiz de /home/guilherme/Projetos/gkdev)
services:
  mongodb:
    image: mongo:7
    container_name: gkdev-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: gkdev
      MONGO_INITDB_ROOT_PASSWORD: gkdev_secret
      MONGO_INITDB_DATABASE: gkdev
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "3001:3000"
    environment:
      MONGODB_URI: mongodb://gkdev:gkdev_secret@mongodb:27017/gkdev?authSource=admin
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

---

## 3. Backend — Next.js (`/home/guilherme/Projetos/gkdev/backend`)

### 3.1 Dependências

```bash
cd backend
npm install mongoose
```

### 3.2 Variáveis de ambiente

`.env.local`:

```env
MONGODB_URI=mongodb://gkdev:gkdev_secret@localhost:27017/gkdev?authSource=admin
```

`.env.example` (atualizar):

```env
DJANGO_AUTH_BASE_URL="https://cemos2028.com"
MONGODB_URI="mongodb://gkdev:gkdev_secret@localhost:27017/gkdev?authSource=admin"
```

### 3.3 Conexão com o MongoDB

`lib/mongodb.js`:

```js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI não definida');

let cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### 3.4 Model da Área

`lib/models/Area.js`:

```js
import mongoose from 'mongoose';

const SubareaSchema = new mongoose.Schema({
  slug:     { type: String, required: true },
  nome:     { type: String, required: true },
  conteudo: { type: String, default: '' }
});

const FerramentaSchema = new mongoose.Schema({
  slug:     { type: String, required: true },
  nome:     { type: String, required: true },
  conteudo: { type: String, default: '' }
});

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url:   { type: String, required: true }
});

const AreaSchema = new mongoose.Schema(
  {
    slug:        { type: String, required: true, unique: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    subareas:    [SubareaSchema],
    ferramentas: [FerramentaSchema],
    materiais:   [MaterialSchema]
  },
  { timestamps: true }
);

export const Area = mongoose.models.Area ?? mongoose.model('Area', AreaSchema);
```

### 3.5 Rotas da API

**`app/api/areas/route.js` — listar todas as áreas:**

```js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Area } from '@/lib/models/Area';

export async function GET() {
  await connectDB();
  const areas = await Area.find({}).sort({ title: 1 }).lean();
  return NextResponse.json(areas);
}
```

---

**`app/api/areas/[slug]/route.js` — buscar e atualizar uma área:**

```js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Area } from '@/lib/models/Area';

export async function GET(request, { params }) {
  await connectDB();
  const area = await Area.findOne({ slug: params.slug }).lean();
  if (!area) return NextResponse.json({ error: 'Área não encontrada' }, { status: 404 });
  return NextResponse.json(area);
}

export async function PUT(request, { params }) {
  await connectDB();
  const body = await request.json();
  const area = await Area.findOneAndUpdate(
    { slug: params.slug },
    { $set: body },
    { new: true, upsert: true, runValidators: true }
  );
  return NextResponse.json(area);
}
```

---

**`app/api/areas/[slug]/subareas/[subareaSlug]/route.js` — atualizar conteúdo de uma subárea:**

```js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Area } from '@/lib/models/Area';

// PATCH body: { conteudo: string }
export async function PATCH(request, { params }) {
  await connectDB();
  const { conteudo } = await request.json();

  const area = await Area.findOneAndUpdate(
    { slug: params.slug, 'subareas.slug': params.subareaSlug },
    { $set: { 'subareas.$.conteudo': conteudo } },
    { new: true }
  );

  if (!area) return NextResponse.json({ error: 'Subárea não encontrada' }, { status: 404 });
  return NextResponse.json(area);
}
```

---

**`app/api/areas/[slug]/ferramentas/[ferramentaSlug]/route.js` — atualizar conteúdo de uma ferramenta:**

```js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Area } from '@/lib/models/Area';

// PATCH body: { conteudo: string }
export async function PATCH(request, { params }) {
  await connectDB();
  const { conteudo } = await request.json();

  const area = await Area.findOneAndUpdate(
    { slug: params.slug, 'ferramentas.slug': params.ferramentaSlug },
    { $set: { 'ferramentas.$.conteudo': conteudo } },
    { new: true }
  );

  if (!area) return NextResponse.json({ error: 'Ferramenta não encontrada' }, { status: 404 });
  return NextResponse.json(area);
}
```

### 3.6 Resumo das rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/api/areas` | Lista todas as áreas |
| `GET`  | `/api/areas/:slug` | Retorna uma área completa |
| `PUT`  | `/api/areas/:slug` | Atualiza ou cria uma área |
| `PATCH`| `/api/areas/:slug/subareas/:subareaSlug` | Atualiza `conteudo` de uma subárea |
| `PATCH`| `/api/areas/:slug/ferramentas/:ferramentaSlug` | Atualiza `conteudo` de uma ferramenta |

### 3.7 Script de seed

`scripts/seed-areas.js` — converte o array estático do frontend para o novo formato:

```js
import mongoose from 'mongoose';

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const AREAS_RAW = [
  {
    slug: 'infraestrutura-ti',
    title: 'Infraestrutura de TI',
    description: 'Arquitetura de infraestrutura, redes, servidores, continuidade, operação e desempenho de ambientes corporativos.',
    subareas: [
      'Arquitetura de infraestrutura de TI',
      'Redes e comunicação de dados',
      'Sistemas operacionais e servidores',
      'Armazenamento e backup',
      'Segurança de infraestrutura',
      'Monitoramento, gestão e automação',
      'Alta disponibilidade e recuperação de desastres',
      'Arquitetura de sistemas web: HTTP, SSL/TLS, proxy, cache, DNS e balanceamento',
      'Escalabilidade e tolerância a falhas em sistemas web e distribuídos',
      'Operação Linux com scripts, observabilidade e troubleshooting'
    ],
    ferramentas: ['Linux', 'Windows Server', 'KVM', 'VMware vSphere/ESXi', 'Zabbix', 'Grafana', 'New Relic', 'Nginx/HAProxy', 'Bash', 'PowerShell', 'Puppet']
  },
  {
    slug: 'engenharia-dados',
    title: 'Engenharia de Dados',
    description: 'Modelagem, integração, pipelines, governança e arquitetura analítica para dados corporativos.',
    subareas: [
      'Bancos de dados relacionais e não relacionais',
      'Arquitetura de inteligência de negócio',
      'Conectores e integração com fontes de dados',
      'ETL e pipeline de dados',
      'Governança e qualidade de dados',
      'Integração com nuvem',
      'Data Warehouse, Data Mart, Data Lake, Data Mesh e modelagem dimensional',
      'SQL, Oracle PL/SQL, otimização de consultas e mapeamento objeto-relacional',
      'NoSQL, indexação de conteúdo e elastic search'
    ],
    ferramentas: ['Oracle Database', 'Microsoft SQL Server', 'MongoDB', 'Elasticsearch', 'ETL', 'Data Warehouse', 'Data Lake', 'OLAP', 'Parquet']
  },
  {
    slug: 'engenharia-software',
    title: 'Engenharia de Software',
    description: 'Processos, arquitetura, engenharia de requisitos, qualidade, integração e entrega de software.',
    subareas: [
      'Arquitetura de software',
      'Design e programação',
      'APIs e integrações',
      'Persistência de dados',
      'DevOps e integração contínua',
      'Testes e qualidade de código',
      'Linguagem Java',
      'Desenvolvimento seguro'
    ],
    ferramentas: ['Java', 'Spring Boot', 'Spring Cloud', 'JPA', 'TypeScript', 'Angular', 'Python', 'Maven', 'npm', 'Git']
  }
  // continuar com as demais áreas de knowledge-catalog.ts...
];

const SubareaSchema = new mongoose.Schema({ slug: String, nome: String, conteudo: { type: String, default: '' } });
const FerramentaSchema = new mongoose.Schema({ slug: String, nome: String, conteudo: { type: String, default: '' } });
const MaterialSchema = new mongoose.Schema({ title: String, url: String });
const AreaSchema = new mongoose.Schema(
  { slug: { type: String, unique: true }, title: String, description: String, subareas: [SubareaSchema], ferramentas: [FerramentaSchema], materiais: [MaterialSchema] },
  { timestamps: true }
);
const Area = mongoose.models.Area ?? mongoose.model('Area', AreaSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  for (const raw of AREAS_RAW) {
    const doc = {
      ...raw,
      subareas:    raw.subareas.map((nome) => ({ slug: toSlug(nome), nome, conteudo: '' })),
      ferramentas: raw.ferramentas.map((nome) => ({ slug: toSlug(nome), nome, conteudo: '' }))
    };

    await Area.findOneAndUpdate({ slug: doc.slug }, { $setOnInsert: doc }, { upsert: true });
    console.log(`✓ ${doc.title}`);
  }

  await mongoose.disconnect();
  console.log('Seed concluído.');
}

seed().catch(console.error);
```

Executar:

```bash
MONGODB_URI=mongodb://gkdev:gkdev_secret@localhost:27017/gkdev?authSource=admin node scripts/seed-areas.js
```

---

## 4. Frontend Angular — `frontend/src/app/features/knowledge`

### 4.1 Atualizar o model

`models/knowledge.model.ts`:

```ts
export interface Subarea {
  slug: string;
  nome: string;
  conteudo: string;
}

export interface Ferramenta {
  slug: string;
  nome: string;
  conteudo: string;
}

export interface KnowledgeArea {
  slug: string;
  title: string;
  description: string;
  subareas: Subarea[];
  ferramentas: Ferramenta[];
  materiais?: { title: string; url: string }[];
}
```

### 4.2 Criar o serviço HTTP

`services/knowledge-api.service.ts`:

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { KnowledgeArea } from '../models/knowledge.model';

@Injectable({ providedIn: 'root' })
export class KnowledgeApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/areas';

  getAreas(): Observable<KnowledgeArea[]> {
    return this.http.get<KnowledgeArea[]>(this.base);
  }

  getArea(slug: string): Observable<KnowledgeArea> {
    return this.http.get<KnowledgeArea>(`${this.base}/${slug}`);
  }

  updateSubareaConteudo(areaSlug: string, subareaSlug: string, conteudo: string): Observable<KnowledgeArea> {
    return this.http.patch<KnowledgeArea>(
      `${this.base}/${areaSlug}/subareas/${subareaSlug}`,
      { conteudo }
    );
  }

  updateFerramentaConteudo(areaSlug: string, ferramentaSlug: string, conteudo: string): Observable<KnowledgeArea> {
    return this.http.patch<KnowledgeArea>(
      `${this.base}/${areaSlug}/ferramentas/${ferramentaSlug}`,
      { conteudo }
    );
  }
}
```

### 4.3 Atualizar o `AreasPageComponent`

`pages/areas-page.component.ts`:

```ts
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { KnowledgeApiService } from '../services/knowledge-api.service';

@Component({
  selector: 'app-areas-page',
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './areas-page.component.html',
  styleUrl: './areas-page.component.scss'
})
export class AreasPageComponent {
  private readonly api = inject(KnowledgeApiService);
  protected readonly areas$ = this.api.getAreas();
}
```

`pages/areas-page.component.html` — os cards continuam exibindo `nome` em vez de string direta:

```html
<section class="header">
  <h1>Repositório de Conhecimentos</h1>
  <p>Navegue pela ementa por áreas e subáreas.</p>
</section>

<section class="grid">
  @if (areas$ | async; as areas) {
    <article class="card" *ngFor="let area of areas">
      <h2>{{ area.title }}</h2>
      <p>{{ area.description }}</p>

      <h3>Subáreas</h3>
      <ul>
        <li *ngFor="let sub of area.subareas | slice:0:4">{{ sub.nome }}</li>
      </ul>

      <h3>Ferramentas</h3>
      <ul>
        <li *ngFor="let f of area.ferramentas | slice:0:4">{{ f.nome }}</li>
      </ul>

      <a [routerLink]="['/areas', area.slug]">Ver área completa</a>
    </article>
  } @else {
    <p>Carregando áreas...</p>
  }
</section>
```

### 4.4 Atualizar o `AreaDetailPageComponent`

`pages/area-detail-page.component.ts`:

```ts
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { KnowledgeApiService } from '../services/knowledge-api.service';

@Component({
  selector: 'app-area-detail-page',
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './area-detail-page.component.html',
  styleUrl: './area-detail-page.component.scss'
})
export class AreaDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(KnowledgeApiService);

  protected readonly area$ = this.route.paramMap.pipe(
    switchMap((params) => this.api.getArea(params.get('slug') ?? ''))
  );
}
```

`pages/area-detail-page.component.html` — exibe conteúdo Markdown quando disponível:

```html
@if (area$ | async; as area) {
  <section class="header">
    <h1>{{ area.title }}</h1>
    <p>{{ area.description }}</p>
    <a routerLink="/areas">← Voltar</a>
  </section>

  <section class="subareas">
    <h2>Subáreas</h2>
    <div *ngFor="let sub of area.subareas" class="item">
      <h3>{{ sub.nome }}</h3>
      <!-- renderizar sub.conteudo como Markdown (ver nota abaixo) -->
      <div *ngIf="sub.conteudo" class="conteudo" [innerHTML]="sub.conteudo"></div>
    </div>
  </section>

  <section class="ferramentas">
    <h2>Ferramentas</h2>
    <div *ngFor="let f of area.ferramentas" class="item">
      <h3>{{ f.nome }}</h3>
      <div *ngIf="f.conteudo" class="conteudo" [innerHTML]="f.conteudo"></div>
    </div>
  </section>
}
```

> **Nota sobre Markdown:** para renderizar o `conteudo` como HTML a partir de Markdown, instale `ngx-markdown` (`npm install ngx-markdown marked`) e substitua `[innerHTML]` pelo componente `<markdown [data]="sub.conteudo">`.

### 4.5 Configurar proxy (desenvolvimento)

`frontend/proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true
  }
}
```

Adicionar ao `angular.json` em `projects.<nome>.architect.serve.options`:

```json
"proxyConfig": "proxy.conf.json"
```

---

## 5. Ordem de Implementação

| # | Tarefa |
|---|--------|
| 1 | Subir MongoDB com Docker Compose |
| 2 | Criar `lib/mongodb.js` e `lib/models/Area.js` no backend |
| 3 | Criar as rotas `/api/areas`, `/api/areas/[slug]`, `/api/areas/[slug]/subareas/[subareaSlug]`, `/api/areas/[slug]/ferramentas/[ferramentaSlug]` |
| 4 | Executar o script de seed para migrar os dados de `knowledge-catalog.ts` |
| 5 | Atualizar `knowledge.model.ts` com as interfaces `Subarea` e `Ferramenta` |
| 6 | Criar `KnowledgeApiService` com os métodos HTTP |
| 7 | Migrar `AreasPageComponent` para consumir a API |
| 8 | Migrar `AreaDetailPageComponent` para consumir a API |
| 9 | Configurar proxy Angular para desenvolvimento |
| 10 | Instalar `ngx-markdown` para renderização de Markdown (opcional) |
| 11 | Remover `knowledge-catalog.ts` após validação em ambiente de testes |

---

## 6. Considerações Futuras

- **Autenticação nas rotas de escrita**: as rotas `PUT` e `PATCH` devem verificar o token JWT via `lib/auth.js` (já existe no projeto) antes de permitir alterações.
- **Geração automática de slug**: o script de seed usa `toSlug()` para gerar slugs a partir dos nomes. Garantir que slugs sejam únicos dentro de cada área.
- **Spring module `ti`**: caso o backend venha a migrar para Spring Boot, o módulo `ti` (`/home/guilherme/Projetos/java/spring/modules/ti`) pode expor os mesmos endpoints usando `spring-data-mongodb`, com `@Document`, `@Field` e os mesmos subdocumentos modelados como classes Java com Lombok.
