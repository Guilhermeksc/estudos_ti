# Comparativo de Arquitetura: MongoDB vs MongoDB + Elasticsearch

## Contexto do projeto

Catálogo de conhecimento (gkdev) com áreas, subáreas e ferramentas armazenadas como documentos com conteúdo em Markdown. Dataset pequeno (~10–20 áreas, ~100–200 subdocumentos). Backend Next.js + Angular.

---

## O problema central: RAM em VPS limitada

```
Orçamento estimado na VPS
─────────────────────────────────────────
MongoDB            →  2 GB (alocado)
Elasticsearch      →  2 GB (alocado)
Spring / Django    →  1–3 GB
Redis              →  ~500 MB
Sistema operacional →  ~1 GB
─────────────────────────────────────────
TOTAL              →  6,5 – 8,5 GB
```

> Esse orçamento assume que todos os serviços rodam **ao mesmo tempo**. Para uma VPS com 8 GB de RAM, não sobra margem de manobra. Para uma com 4–6 GB, o stack não cabe.

---

## Comparativo por opção

### Opção A — MongoDB apenas *(plano atual)*

| Critério | Avaliação |
|---|---|
| RAM real (em uso) | ~300–600 MB |
| RAM alocada | até 2 GB (configurável) |
| Full-text search | `$text` index + `$search` via Atlas / nativo |
| Complexidade operacional | Baixa — 1 serviço |
| Fit para o dataset | Excelente — documentos flexíveis em JSON |
| Busca em Markdown | Suficiente para ~200 docs |
| Curva de aprendizado | Já está implementado no projeto |

**Quando é suficiente:** qualquer cenário onde o número de documentos é menor que ~100k e a busca não precisa de relevância avançada (sinônimos, stemming, fuzzy por padrão). Para o gkdev, cobre 100% dos requisitos atuais.

```js
// Criar índice de texto no MongoDB — cobre todos os campos de conteúdo
db.areas.createIndex({
  title: 'text',
  description: 'text',
  'subareas.nome': 'text',
  'subareas.conteudo': 'text',
  'ferramentas.nome': 'text',
  'ferramentas.conteudo': 'text'
})

// Busca
db.areas.find({ $text: { $search: 'nginx load balancer' } })
```

---

### Opção B — MongoDB + Elasticsearch

| Critério | Avaliação |
|---|---|
| RAM real (em uso) | ~2,5–4 GB (os dois juntos) |
| Full-text search | Lucene completo: fuzzy, sinônimos, boosting, highlighting |
| Complexidade operacional | Alta — sincronização MongoDB ↔ ES, 2 serviços, mapeamentos |
| Fit para o dataset | Superdimensionado — ES é projetado para bilhões de docs |
| Sincronização | Precisa de pipeline: Change Streams → ES ou Logstash/Monstache |
| Quando justifica | Busca em texto de artigos de notícias, e-commerce, logs |

**Custo de manter a sincronia:**

```
MongoDB (source of truth)
        │
        ▼  Change Stream / Debezium / Monstache
Elasticsearch (índice de busca)
        │
        ▼  API de busca separada ou roteamento no backend
```

Qualquer escrita no MongoDB precisa ser indexada no ES. Isso adiciona latência, ponto de falha e overhead operacional contínuo.

---

### Opção C — PostgreSQL apenas *(alternativa leve)*

| Critério | Avaliação |
|---|---|
| RAM real (em uso) | ~150–400 MB |
| Full-text search | `tsvector` + `tsquery` + `pg_trgm` |
| JSONB | Suporta campos semi-estruturados como os do modelo atual |
| Complexidade operacional | Baixa — 1 serviço, sem sincronização |
| Fit para o projeto | Bom se as relações entre áreas crescerem |
| Migração | Reescrever modelo + queries (maior esforço) |

---

### Opção D — SQLite *(mínimo absoluto)*

| Critério | Avaliação |
|---|---|
| RAM real (em uso) | ~30–80 MB |
| Full-text search | FTS5 nativo |
| Concorrência | Não suporta múltiplos writers simultâneos |
| Fit para o projeto | Bom para portfolio read-heavy sem escrita concorrente |
| Complexidade operacional | Zero — arquivo em disco |

---

## Tabela resumo

| Stack | RAM estimada | Busca full-text | Complexidade | Recomendado para gkdev |
|---|---|---|---|---|
| **MongoDB only** | 300–600 MB | `$text` (adequado) | Baixa | **Sim — plano atual correto** |
| MongoDB + Elasticsearch | 2,5–4 GB | Lucene (avançada) | Alta | Não — overkill |
| PostgreSQL only | 150–400 MB | `tsvector` (adequado) | Baixa | Sim (alternativa válida) |
| SQLite | 30–80 MB | FTS5 (adequado) | Mínima | Sim (se leitura >> escrita) |

---

## Quando Elasticsearch **realmente** faz sentido

Elasticsearch justifica sua presença quando **dois ou mais** dos itens abaixo são verdadeiros:

- [ ] Dataset com **> 500k documentos** ou conteúdo de texto muito longo (artigos, logs)
- [ ] Necessidade de **relevância avançada** (boosting por campo, sinônimos customizados, stemming por idioma)
- [ ] **Busca geoespacial** combinada com texto
- [ ] **Analytics em tempo real** sobre eventos (Kibana stack)
- [ ] Mais de **1 instância de backend** que precisam de um índice centralizado
- [ ] **Autocomplete** com alta carga de usuários concorrentes

Para o gkdev hoje: **nenhum** desses critérios se aplica.

---

## Recomendação

**Manter MongoDB apenas**, conforme o plano atual (`mongodb-areas-implementation.md`).

Para busca, adicionar um índice composto de texto no MongoDB é suficiente e gratuito em termos de infraestrutura. Se a busca evoluir para requisitos mais complexos no futuro (ex.: o projeto crescer para um produto com muitos usuários e grande volume de conteúdo), a migração para Elasticsearch pode ser planejada com tempo — e o modelo de dados atual no MongoDB já facilitaria essa exportação.

```
Arquitetura recomendada para a VPS atual
─────────────────────────────────────────
MongoDB            →  ~500 MB (real)
Next.js backend    →  ~200 MB
Angular (build estático via Nginx)  →  ~50 MB
Redis (opcional)   →  ~100 MB
Nginx              →  ~30 MB
Sistema operacional →  ~1 GB
─────────────────────────────────────────
TOTAL              →  ~2 GB    ← cabe em qualquer VPS razoável
```

---

## Referências de escala (para calibrar a decisão no futuro)

| Volume de docs | Ferramenta adequada |
|---|---|
| < 10k | MongoDB `$text`, SQLite FTS5, PostgreSQL `tsvector` |
| 10k – 1M | MongoDB Atlas Search, PostgreSQL + `pg_trgm` |
| > 1M | Elasticsearch, OpenSearch, Typesense |
