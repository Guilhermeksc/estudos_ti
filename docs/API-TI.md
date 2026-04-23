# API do Módulo TI

Base URL local:

```text
http://localhost:8000/api
```

Em produção, use o domínio público do backend seguido de `/api`.

## Autenticação

Os endpoints `GET` de TI são públicos.

Operações de escrita exigem Bearer token com role `ADMIN` ou `EDITOR`:

```http
Authorization: Bearer <access_token>
```

## Matérias e Cards

### Listar cards ativos

```http
GET /api/ti/materias/cards
```

Retorna os cards usados pelo frontend para montar a tela do módulo TI.

```json
[
  {
    "id": 1,
    "slug": "infraestrutura-ti",
    "titulo": "Infraestrutura de TI",
    "descricao": "Arquitetura de infraestrutura, redes...",
    "areaSlug": "infraestrutura-ti",
    "subareasCount": 3,
    "ferramentasCount": 3
  }
]
```

### Listar matérias completas

```http
GET /api/ti/materias
```

### Buscar matéria por ID

```http
GET /api/ti/materias/{id}
```

### Carregar área completa vinculada ao MongoDB

```http
GET /api/ti/materias/area-completa/{areaSlug}
```

Retorna a matéria do PostgreSQL e o documento da área no MongoDB.

```json
{
  "materia": {
    "id": 1,
    "slug": "infraestrutura-ti",
    "titulo": "Infraestrutura de TI",
    "descricao": "Arquitetura de infraestrutura...",
    "areaSlug": "infraestrutura-ti",
    "ativo": true,
    "ordem": 10,
    "subareas": [],
    "ferramentas": []
  },
  "area": {
    "id": "6628...",
    "slug": "infraestrutura-ti",
    "title": "Infraestrutura de TI",
    "description": "...",
    "subareas": [
      {
        "slug": "redes-e-comunicacao",
        "nome": "Redes e comunicação de dados",
        "conteudo": "# Markdown..."
      }
    ],
    "ferramentas": [],
    "materiais": []
  }
}
```

### Criar matéria

```http
POST /api/ti/materias
```

Retorna `201 Created`.

```json
{
  "slug": "infraestrutura-ti",
  "titulo": "Infraestrutura de TI",
  "descricao": "Arquitetura de infraestrutura, redes e servidores.",
  "areaSlug": "infraestrutura-ti",
  "ativo": true,
  "ordem": 10,
  "subareas": [
    {
      "slug": "redes-e-comunicacao",
      "titulo": "Redes e comunicação de dados",
      "descricao": "Protocolos, VLANs, roteamento e switching.",
      "ordem": 10
    }
  ],
  "ferramentas": [
    {
      "slug": "linux",
      "titulo": "Linux",
      "descricao": "Administração e hardening de servidores Linux.",
      "ordem": 10
    }
  ]
}
```

### Atualizar matéria

```http
PUT /api/ti/materias/{id}
```

Usa o mesmo payload do `POST`.

### Excluir matéria

```http
DELETE /api/ti/materias/{id}
```

Retorna `204 No Content`.

## Questões de Múltipla Escolha

Tabela PostgreSQL: `ti_questoes_multipla`.

### Listar

```http
GET /api/ti/questoes/multipla
```

Filtros opcionais:

```text
materiaId
subareaId
banca
orgao
anoProva
aprovado
ativo
search
page
size
sort
```

Exemplo:

```http
GET /api/ti/questoes/multipla?subareaId=1&banca=CEBRASPE&anoProva=2023
```

### Buscar por ID

```http
GET /api/ti/questoes/multipla/{id}
```

### Criar

```http
POST /api/ti/questoes/multipla
```

Retorna `201 Created`.

```json
{
  "materia_id": 1,
  "subarea_id": 1,
  "banca": "CEBRASPE",
  "orgao": "DATAPREV",
  "enunciado": "Sobre redes de computadores, assinale a alternativa correta.",
  "alternativa_a": "Texto da alternativa A.",
  "alternativa_b": "Texto da alternativa B.",
  "alternativa_c": "Texto da alternativa C.",
  "alternativa_d": "Texto da alternativa D.",
  "alternativa_e": "Texto da alternativa E.",
  "alternativa_correta": "a",
  "justificativa_resposta_certa": "A alternativa A está correta porque...",
  "ano_prova": 2023,
  "nivel": "medio",
  "ativo": true,
  "aprovado": true
}
```

`alternativa_correta` aceita apenas:

```text
a, b, c, d, e
```

### Atualizar

```http
PUT /api/ti/questoes/multipla/{id}
```

### Excluir

```http
DELETE /api/ti/questoes/multipla/{id}
```

Retorna `204 No Content`.

## Questões V/F

Tabela PostgreSQL: `ti_questoes_vf`.

### Listar

```http
GET /api/ti/questoes/vf
```

Filtros opcionais:

```text
materiaId
subareaId
banca
orgao
anoProva
resposta
aprovado
ativo
search
page
size
sort
```

Exemplo:

```http
GET /api/ti/questoes/vf?resposta=true&search=virtualização
```

### Buscar por ID

```http
GET /api/ti/questoes/vf/{id}
```

### Criar

```http
POST /api/ti/questoes/vf
```

Retorna `201 Created`.

```json
{
  "materia_id": 1,
  "subarea_id": 1,
  "banca": "CEBRASPE",
  "orgao": "DATAPREV",
  "afirmacao": "A virtualização permite executar múltiplos sistemas operacionais sobre o mesmo hardware físico.",
  "resposta_utilizada_banca": true,
  "justificativa_resposta_certa": "A afirmação está correta porque o hipervisor abstrai os recursos físicos...",
  "ano_prova": 2023,
  "nivel": "medio",
  "ativo": true,
  "aprovado": true
}
```

### Atualizar

```http
PUT /api/ti/questoes/vf/{id}
```

### Excluir

```http
DELETE /api/ti/questoes/vf/{id}
```

Retorna `204 No Content`.

## Flashcards de TI

Tabela PostgreSQL: `ti_flashcards`.

### Listar

```http
GET /api/ti/flashcards
```

Filtros opcionais:

```text
materiaId
subareaId
ferramentaId
aprovado
ativo
search
page
size
sort
```

### Buscar por ID

```http
GET /api/ti/flashcards/{id}
```

### Criar

```http
POST /api/ti/flashcards
```

Retorna `201 Created`.

```json
{
  "materia_id": 1,
  "subarea_id": 1,
  "ferramenta_id": 1,
  "pergunta": "O que é um hipervisor tipo 1?",
  "resposta": "É um hipervisor que executa diretamente sobre o hardware físico.",
  "fonte": "Resumo de virtualização",
  "nivel": "basico",
  "ativo": true,
  "aprovado": true
}
```

### Atualizar

```http
PUT /api/ti/flashcards/{id}
```

### Excluir

```http
DELETE /api/ti/flashcards/{id}
```

Retorna `204 No Content`.

## Importação CSV

Todos os endpoints abaixo exigem `multipart/form-data`, campo `file` e role `ADMIN` ou `EDITOR`.
O parâmetro `batchSize` é opcional, padrão `20`, mínimo `1`, máximo `100`.

```http
POST /api/ti/importacao/multipla/csv?batchSize=20
POST /api/ti/importacao/vf/csv?batchSize=20
POST /api/ti/importacao/flashcards/csv?batchSize=20
```

Resposta:

```json
{
  "tipo": "multipla",
  "batchSize": 20,
  "linhasLidas": 10,
  "lotesProcessados": 1,
  "criadas": 9,
  "falhas": 1,
  "erros": [
    { "linha": 4, "mensagem": "Campo obrigatório ausente: enunciado" }
  ]
}
```

Colunas obrigatórias:

```text
multipla: subarea_id, banca, orgao, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, alternativa_correta, justificativa_resposta_certa, ano_prova
vf: subarea_id, banca, orgao, afirmacao, resposta_utilizada_banca, justificativa_resposta_certa, ano_prova
flashcards: pergunta, resposta
```

Colunas opcionais aceitas:

```text
materia_id, ferramenta_id, nivel, ativo, aprovado, fonte
```

Valores booleanos aceitos:

```text
true, false, 1, 0, sim, nao, não, s, n, yes, no, verdadeiro, falso
```

## Contratos Para Angular

Use `environment.apiUrl` como base. No projeto atual:

```ts
private readonly base = `${environment.apiUrl}/ti`;
```

Os `GET` são públicos. `POST`, `PUT`, `PATCH`, `DELETE` e importação CSV usam o interceptor de autenticação já existente para enviar o Bearer token.

### Paginação

Questões e flashcards retornam `PageResponse<T>`.

```ts
export interface PageResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PageQuery {
  page?: number;
  size?: number;
  sort?: string | string[];
}
```

Parâmetros nulos, `undefined` ou string vazia não devem ser enviados. Monte `HttpParams` apenas com filtros preenchidos.
Para renderizar tabelas, use `response.results` como linhas e `response.count` como total.

### Interfaces

Sugestão de arquivo: `frontend/src/app/interfaces/ti.interface.ts`.

```ts
export interface TiSubarea {
  id?: number | null;
  slug: string;
  titulo: string;
  descricao?: string | null;
  ordem?: number | null;
}

export interface TiFerramenta {
  id?: number | null;
  slug: string;
  titulo: string;
  descricao?: string | null;
  ordem?: number | null;
}

export interface TiMateria {
  id?: number | null;
  slug: string;
  titulo: string;
  descricao: string;
  areaSlug: string;
  ativo?: boolean | null;
  ordem?: number | null;
  subareas?: TiSubarea[];
  ferramentas?: TiFerramenta[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TiMateriaCard {
  id: number;
  slug: string;
  titulo: string;
  descricao: string;
  areaSlug: string;
  subareasCount: number;
  ferramentasCount: number;
}

export interface TiAreaItem {
  slug: string;
  nome: string;
  conteudo: string;
}

export interface TiMaterial {
  title: string;
  url: string;
}

export interface TiAreaConhecimento {
  id?: string | null;
  slug: string;
  title: string;
  description: string;
  subareas: TiAreaItem[];
  ferramentas: TiAreaItem[];
  materiais: TiMaterial[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TiMateriaAreaCompleta {
  materia: TiMateria;
  area: TiAreaConhecimento;
}

export interface TiQuestaoMultipla {
  id?: number | null;
  materia_id?: number | null;
  materia_titulo?: string | null;
  subarea_id?: number | null;
  subarea_titulo?: string | null;
  banca: string;
  orgao: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  alternativa_e: string;
  alternativa_correta: 'a' | 'b' | 'c' | 'd' | 'e';
  justificativa_resposta_certa: string;
  ano_prova?: number | null;
  nivel?: string | null;
  ativo?: boolean | null;
  aprovado?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TiQuestaoVf {
  id?: number | null;
  materia_id?: number | null;
  materia_titulo?: string | null;
  subarea_id?: number | null;
  subarea_titulo?: string | null;
  banca: string;
  orgao: string;
  afirmacao: string;
  resposta_utilizada_banca: boolean;
  justificativa_resposta_certa: string;
  ano_prova?: number | null;
  nivel?: string | null;
  ativo?: boolean | null;
  aprovado?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TiFlashcard {
  id?: number | null;
  materia_id?: number | null;
  materia_titulo?: string | null;
  subarea_id?: number | null;
  subarea_titulo?: string | null;
  ferramenta_id?: number | null;
  ferramenta_titulo?: string | null;
  pergunta: string;
  resposta: string;
  fonte?: string | null;
  nivel?: string | null;
  ativo?: boolean | null;
  aprovado?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TiCsvImportError {
  linha: number;
  mensagem: string;
}

export interface TiCsvImportResponse {
  tipo: 'multipla' | 'vf' | 'flashcards';
  batchSize: number;
  linhasLidas: number;
  lotesProcessados: number;
  criadas: number;
  falhas: number;
  erros: TiCsvImportError[];
}
```

### Services

Sugestão: manter `TiMateriasService` e criar services separados para CRUDs maiores:

```text
frontend/src/app/services/ti-materias.service.ts
frontend/src/app/services/ti-questoes-multipla.service.ts
frontend/src/app/services/ti-questoes-vf.service.ts
frontend/src/app/services/ti-flashcards.service.ts
frontend/src/app/services/ti-importacao.service.ts
frontend/src/app/services/ti-areas.service.ts
```

#### Service de matérias

O projeto já possui `frontend/src/app/services/ti-materias.service.ts`. Complete apenas o método de busca por ID, se necessário:

```ts
buscar(id: number): Observable<TiMateria> {
  return this.http.get<TiMateria>(`${this.baseUrl}/${id}`);
}
```

#### Params HTTP

O projeto já possui `frontend/src/app/services/http-params.ts` com `buildHttpParams`.
Use esse helper nos services abaixo. Se precisar enviar múltiplos `sort`, adapte o helper para usar `append`.

#### Questões múltipla escolha

```ts
@Injectable({ providedIn: 'root' })
export class TiQuestoesMultiplaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ti/questoes/multipla`;

  listar(filtros: PageQuery & {
    materiaId?: number;
    subareaId?: number;
    banca?: string;
    orgao?: string;
    anoProva?: number;
    aprovado?: boolean;
    ativo?: boolean;
    search?: string;
  } = {}): Observable<PageResponse<TiQuestaoMultipla>> {
    return this.http.get<PageResponse<TiQuestaoMultipla>>(this.baseUrl, { params: buildHttpParams(filtros) });
  }

  buscar(id: number): Observable<TiQuestaoMultipla> {
    return this.http.get<TiQuestaoMultipla>(`${this.baseUrl}/${id}`);
  }

  criar(payload: TiQuestaoMultipla): Observable<TiQuestaoMultipla> {
    return this.http.post<TiQuestaoMultipla>(this.baseUrl, payload);
  }

  atualizar(id: number, payload: TiQuestaoMultipla): Observable<TiQuestaoMultipla> {
    return this.http.put<TiQuestaoMultipla>(`${this.baseUrl}/${id}`, payload);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

#### Questões V/F

```ts
@Injectable({ providedIn: 'root' })
export class TiQuestoesVfService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ti/questoes/vf`;

  listar(filtros: PageQuery & {
    materiaId?: number;
    subareaId?: number;
    banca?: string;
    orgao?: string;
    anoProva?: number;
    resposta?: boolean;
    aprovado?: boolean;
    ativo?: boolean;
    search?: string;
  } = {}): Observable<PageResponse<TiQuestaoVf>> {
    return this.http.get<PageResponse<TiQuestaoVf>>(this.baseUrl, { params: buildHttpParams(filtros) });
  }

  buscar(id: number): Observable<TiQuestaoVf> {
    return this.http.get<TiQuestaoVf>(`${this.baseUrl}/${id}`);
  }

  criar(payload: TiQuestaoVf): Observable<TiQuestaoVf> {
    return this.http.post<TiQuestaoVf>(this.baseUrl, payload);
  }

  atualizar(id: number, payload: TiQuestaoVf): Observable<TiQuestaoVf> {
    return this.http.put<TiQuestaoVf>(`${this.baseUrl}/${id}`, payload);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

#### Flashcards

```ts
@Injectable({ providedIn: 'root' })
export class TiFlashcardsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ti/flashcards`;

  listar(filtros: PageQuery & {
    materiaId?: number;
    subareaId?: number;
    ferramentaId?: number;
    aprovado?: boolean;
    ativo?: boolean;
    search?: string;
  } = {}): Observable<PageResponse<TiFlashcard>> {
    return this.http.get<PageResponse<TiFlashcard>>(this.baseUrl, { params: buildHttpParams(filtros) });
  }

  buscar(id: number): Observable<TiFlashcard> {
    return this.http.get<TiFlashcard>(`${this.baseUrl}/${id}`);
  }

  criar(payload: TiFlashcard): Observable<TiFlashcard> {
    return this.http.post<TiFlashcard>(this.baseUrl, payload);
  }

  atualizar(id: number, payload: TiFlashcard): Observable<TiFlashcard> {
    return this.http.put<TiFlashcard>(`${this.baseUrl}/${id}`, payload);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

#### Importação CSV

```ts
export type TiCsvImportTipo = 'multipla' | 'vf' | 'flashcards';

@Injectable({ providedIn: 'root' })
export class TiImportacaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ti/importacao`;

  importar(tipo: TiCsvImportTipo, file: File, batchSize = 20): Observable<TiCsvImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const params = new HttpParams().set('batchSize', String(batchSize));
    return this.http.post<TiCsvImportResponse>(`${this.baseUrl}/${tipo}/csv`, formData, { params });
  }
}
```

Não defina manualmente o header `Content-Type` no upload; o browser precisa preencher o boundary do `multipart/form-data`.

#### Áreas MongoDB

```ts
@Injectable({ providedIn: 'root' })
export class TiAreasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/areas`;

  listar(): Observable<TiAreaConhecimento[]> {
    return this.http.get<TiAreaConhecimento[]>(this.baseUrl);
  }

  buscar(slug: string): Observable<TiAreaConhecimento> {
    return this.http.get<TiAreaConhecimento>(`${this.baseUrl}/${slug}`);
  }

  salvar(slug: string, payload: Omit<TiAreaConhecimento, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Observable<TiAreaConhecimento> {
    return this.http.put<TiAreaConhecimento>(`${this.baseUrl}/${slug}`, payload);
  }

  atualizarConteudoSubarea(slug: string, subareaSlug: string, conteudo: string): Observable<TiAreaConhecimento> {
    return this.http.patch<TiAreaConhecimento>(`${this.baseUrl}/${slug}/subareas/${subareaSlug}`, { conteudo });
  }

  atualizarConteudoFerramenta(slug: string, ferramentaSlug: string, conteudo: string): Observable<TiAreaConhecimento> {
    return this.http.patch<TiAreaConhecimento>(`${this.baseUrl}/${slug}/ferramentas/${ferramentaSlug}`, { conteudo });
  }
}
```

### CRUD Angular Recomendado

Para cada tela de CRUD (`materias`, `multipla`, `vf`, `flashcards`):

```text
1. Listagem com filtros, paginação e botão de limpar filtros.
2. Botão criar abre formulário com valores padrão: ativo=true, aprovado=true, ordem=0 quando existir.
3. Edição carrega item por id antes de preencher o formulário.
4. Salvar usa POST quando não houver id e PUT quando houver id.
5. Excluir pede confirmação e espera 204.
6. Mostrar erros de validação do backend a partir de $.message e $.fieldErrors.
```

Campos obrigatórios no frontend:

```text
matéria: slug, titulo, descricao, areaSlug
subárea/ferramenta: slug, titulo
múltipla: banca, orgao, enunciado, alternativas A-E, alternativa_correta, justificativa_resposta_certa
V/F: banca, orgao, afirmacao, resposta_utilizada_banca, justificativa_resposta_certa
flashcard: pergunta, resposta
```

Para montar selects de relacionamento:

```text
materia_id: GET /api/ti/materias
subarea_id: subareas da matéria selecionada
ferramenta_id: ferramentas da matéria selecionada
```

## Relações

```text
ti_materias 1:N ti_subareas
ti_materias 1:N ti_ferramentas
ti_materias 1:N ti_questoes_multipla
ti_subareas 1:N ti_questoes_multipla
ti_materias 1:N ti_questoes_vf
ti_subareas 1:N ti_questoes_vf
ti_materias 1:N ti_flashcards
ti_subareas 1:N ti_flashcards
ti_ferramentas 1:N ti_flashcards
```

## Observações Para Frontend Futuro

- Use `GET /api/ti/materias/cards` para montar os cards do módulo TI.
- Use `GET /api/ti/materias/area-completa/{areaSlug}` ao clicar em “Ver área completa”.
- Use os endpoints de questões/flashcards com paginação para telas de CRUD.
- Os payloads de questões foram desenhados para receber diretamente dados gerados nos modelos markdown:
  - `questao-multipla.md`
  - `questaov-f.md`
