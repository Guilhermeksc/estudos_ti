# Roteiro de Estudos — Tópico 1: Arquitetura de Infraestrutura de TI

**Duração sugerida:** 7 dias (alinhado à Semana 1 do cronograma geral)
**Carga diária:** ~3h (2h teoria + 1h lab/questões)
**Pré-requisito:** noção básica de redes e virtualização (se não tiver, reserve 1 dia extra antes)

---

## Objetivos de aprendizagem

Ao final deste tópico, você deve conseguir:

1. Diferenciar topologia **física** de **lógica** e reconhecer topologias modernas de data center (leaf-spine, three-tier).
2. Explicar as arquiteturas de DC **on-premises, cloud e híbrida** e saber quando cada uma é indicada.
3. Descrever o que é **hiperconvergência (HCI)**, o que a diferencia de convergência e de arquiteturas desagregadas.
4. Dominar os conceitos de **escalabilidade (scale-up × scale-out)**, **redundância (N, N+1, 2N, 2N+1)** e **tolerância a falhas (SPOF, MTBF, MTTR, disponibilidade em "9s")**.
5. Resolver questões CESPE de nível médio-alto sobre esses temas com justificativa técnica sólida.

---

## Plano de 7 dias

| Dia | Foco | Saída esperada |
|-----|------|----------------|
| 1 (Seg) | Topologias físicas e lógicas | Quadro comparativo das topologias + diagrama leaf-spine |
| 2 (Ter) | Arquiteturas de DC: on-premises e Tiers | Tabela Uptime Tiers I–IV + checklist TIA-942 |
| 3 (Qua) | Cloud (IaaS/PaaS/SaaS) e modelos de implantação | Mapa de responsabilidade compartilhada |
| 4 (Qui) | Arquitetura híbrida e multicloud | Diagrama simples DC on-prem + VPC AWS via VPN |
| 5 (Sex) | Hiperconvergência (HCI) | Quadro: Tradicional × Convergente × HCI |
| 6 (Sáb) | Escalabilidade, redundância, tolerância a falhas | Cálculos de disponibilidade (9s) + MTBF/MTTR |
| 7 (Dom) | Revisão + 20 questões (via agente gerador) | Mapa mental final + gabarito comentado |

---

## Módulo 1 — Topologias físicas e lógicas

### Conceitos que você precisa dominar

**Topologias físicas clássicas** (como os cabos estão dispostos):

- **Barramento (bus):** todos os nós no mesmo meio físico. Obsoleta em LANs corporativas, mas ainda cobrada em prova pelo conceito.
- **Estrela (star):** todos os nós ligados a um concentrador central (switch/hub). É o padrão em LANs Ethernet modernas.
- **Anel (ring):** nós ligados em loop. Sobrevive em Token Ring (legado) e em backbones metropolitanos com RPR/Resilient Packet Ring.
- **Malha (mesh):** cada nó conecta-se a vários outros.
  - *Full mesh:* todos-com-todos → N(N-1)/2 enlaces.
  - *Partial mesh:* apenas nós críticos são totalmente conectados.
- **Árvore/hierárquica:** estrelas conectadas hierarquicamente.
- **Híbrida:** combinação das anteriores (realidade da maioria dos DCs).

**Topologia lógica** = como os dados *fluem*, não como os cabos estão.

- Ethernet switched: fisicamente estrela, logicamente **broadcast** dentro do mesmo domínio L2.
- Token Ring: fisicamente estrela (com MSAU), logicamente **anel** com passagem de token.

> **Pegadinha CESPE clássica:** "A topologia física e a lógica são sempre iguais." → **ERRADO**. A diferença entre elas é fonte comum de questões.

**Topologias de data center modernas** (o que realmente cai em concurso atual):

- **Three-tier (Cisco hierárquico):** Core → Distribution (Aggregation) → Access. Projetada para tráfego predominantemente *north-south* (cliente ↔ servidor).
- **Leaf-spine (Clos):** dois níveis apenas. Cada *leaf* (ToR) conecta-se a **todos** os *spines*. Projetada para tráfego *east-west* (servidor ↔ servidor), típico de aplicações modernas, HCI, Big Data e microsserviços.
- **Fat-tree:** variação do Clos, comum em HPC e em papers acadêmicos (Al-Fares et al.).
- **Spine-leaf com overlay:** VXLAN + EVPN sobre leaf-spine — padrão em DCs que precisam de segmentação L2 estendida.

**Tráfego north-south × east-west**

- *North-south:* entra/sai do DC (usuário final).
- *East-west:* entre servidores dentro do DC. Hoje representa **>70%** do tráfego em muitos DCs (uma das razões do leaf-spine ter substituído o three-tier).

### Fontes oficiais (com links)

- **Cisco — Data Center Spine-and-Leaf Architecture: Design Overview** (whitepaper oficial, o mais cobrado em concursos): <https://cisco-apps.cisco.com/c/en/us/products/collateral/switches/nexus-7000-series-switches/white-paper-c11-737022.html>
- **Cisco — Massively Scalable Data Center Network Fabric Design** (evolução do Clos em ambientes hyperscale): <https://www.cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-743245.html>
- **NetworkLessons — Spine and Leaf Architecture** (explicação didática, nível CCNP): <https://networklessons.com/network-fundamentals/spine-and-leaf-architecture>
- **NetworkAcademy.IO — Leaf-Spine Architecture**: <https://www.networkacademy.io/ccna/network-fundamentals/leaf-spine-architecture>
- **9tut — Spine-Leaf Architecture Tutorial** (voltado para CCNA): <https://www.9tut.com/spine-leaf-architecture-tutorial>
- **Red Hat — Introduction to spine-leaf networking**: <https://docs.redhat.com/en/documentation/red_hat_openstack_platform/17.1/html/configuring_spine-leaf_networking/assembly_introduction-to-spine-leaf-networking>

**Vídeos recomendados:**

- *Spine and Leaf network architecture explained | CCNA 200-301* (David Bombal, inglês, ~15 min): <https://www.youtube.com/watch?v=xjc7WLBb-nI>
- *What is Spine leaf architectures | CCNA* (Network Zeal, inglês, direto ao ponto): <https://www.youtube.com/watch?v=GEMzMIFapeA>
- *Spine and Leaf Design: Cisco ACI* (tutorial com ACI): <https://www.youtube.com/watch?v=LYWMPE86EiQ>

---

## Módulo 2 — Arquiteturas de Data Center

### 2.1 On-premises

**Componentes físicos principais:**

- **Racks** (padrão 19"), **PDUs** (Power Distribution Units), **UPS** (no-break), **geradores**.
- **Resfriamento:** CRAC (Computer Room Air Conditioner) ou CRAH (Air Handler), organização *hot aisle / cold aisle* com *containment*.
- **Piso elevado** (raised floor) para passagem de cabeamento e insuflamento de ar.
- **Cabeamento estruturado:** TIA-942 define zonas (MDA, HDA, ZDA, EDA).

**Classificação Uptime Institute (Tier Standard):** este é o ponto mais cobrado.

| Tier | Redundância | Disponibilidade anual | Downtime máx/ano |
|------|-------------|----------------------|------------------|
| I    | N           | 99,671%              | ~28,8 h          |
| II   | N+1 (componentes redundantes) | 99,741% | ~22 h |
| III  | N+1 + manutenção concorrente (*concurrently maintainable*) | 99,982% | ~1,6 h |
| IV   | 2N ou 2(N+1), *fault tolerant* | 99,995% | ~26 min |

**Conceitos de redundância:**

- **N:** capacidade mínima para operar.
- **N+1:** um componente extra. Um pode falhar/entrar em manutenção sem parar.
- **2N:** tudo duplicado (dois caminhos elétricos completos, duas fontes, etc.).
- **2(N+1) ou 2N+1:** duplicação com componente extra em cada caminho.

> **Pegadinha frequente:** Tier III é *concurrently maintainable* (manutenção concorrente), mas **não é tolerante a falha simples de maneira total** — isso é Tier IV. O examinador troca os dois.

### 2.2 Cloud

**Modelos de serviço (NIST SP 800-145):**

| Modelo | O que a cloud gerencia | O que você gerencia |
|--------|------------------------|---------------------|
| IaaS   | Rede, storage, virtualização, hardware | SO, middleware, runtime, dados, aplicação |
| PaaS   | Tudo até runtime        | Apenas aplicação + dados |
| SaaS   | Tudo                    | Apenas configurações + dados do usuário |
| FaaS/Serverless | Tudo, inclusive runtime | Só o código da função |

**Modelos de implantação (NIST):**

- **Pública:** recursos compartilhados via internet (AWS, Azure, GCP).
- **Privada:** infra dedicada (on-prem ou hospedada) para uma única organização.
- **Híbrida:** duas ou mais nuvens (ex.: privada + pública) integradas por tecnologia padronizada.
- **Comunitária:** compartilhada por organizações com interesses comuns (governo, saúde).

**Conceitos geográficos (cobrados em prova):**

- **Região:** área geográfica (ex.: *sa-east-1* = São Paulo).
- **Zona de disponibilidade (AZ):** um ou mais DCs isolados dentro de uma região. Arquitetura **multi-AZ** = alta disponibilidade regional.
- **Edge location / PoP:** ponto de presença para CDN (ex.: CloudFront, Azure Front Door).

**Modelo de responsabilidade compartilhada** (Shared Responsibility): o provedor é responsável pela segurança **DA nuvem** (infra física, hipervisor); o cliente, **NA nuvem** (SO guest, dados, IAM, patch da aplicação).

### 2.3 Híbrida e multicloud

**Diferença importante:**

- **Híbrida:** combina cloud privada (ou on-prem) + cloud pública, integradas.
- **Multicloud:** uso de múltiplas clouds públicas (ex.: AWS + Azure) — não necessariamente integradas.

**Conectividade entre on-prem e cloud:**

- **VPN site-to-site:** IPsec sobre internet pública. Barato, mas latência/throughput variáveis.
- **Link dedicado:** AWS **Direct Connect**, Azure **ExpressRoute**, GCP **Cloud Interconnect**, Oracle **FastConnect**. Latência previsível, SLA, maior custo.

**Casos típicos da híbrida:**

- **Cloud bursting:** carga base on-prem, picos na cloud pública.
- **DR na cloud:** produção on-prem, site de recuperação na cloud (pilot light ou warm standby).
- **Dados sensíveis on-prem** + frontend/apresentação na cloud.

**Estratégias de migração (AWS 6 Rs / 7 Rs):**

Rehost (*lift-and-shift*), Replatform (*lift-tinker-and-shift*), Repurchase (troca por SaaS), Refactor, Retire, Retain, Relocate.

### Fontes oficiais (com links)

**Cloud — documentos fundamentais:**

- **NIST SP 800-145 — The NIST Definition of Cloud Computing** (página oficial): <https://csrc.nist.gov/pubs/sp/800/145/final>
- **NIST SP 800-145 — PDF direto** (7 páginas, leitura obrigatória): <https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-145.pdf>
- **AWS — PaaS vs IaaS vs SaaS (Google Cloud, comparativo claro)**: <https://cloud.google.com/learn/paas-vs-iaas-vs-saas>
- **IBM — IaaS, PaaS, SaaS: What's the difference?**: <https://www.ibm.com/think/topics/iaas-paas-saas>

**Data Center on-premises — Tier Standard:**

- **Uptime Institute — Tier Classification System** (página principal): <https://uptimeinstitute.com/tiers>
- **Uptime Institute — Explicação do Tier Classification** (blog detalhado): <https://journal.uptimeinstitute.com/explaining-uptime-institutes-tier-classification-system/>
- **TechTarget — Uptime Institute's Data Center Tier Standards** (visão prática): <https://www.techtarget.com/searchdatacenter/definition/Uptime-data-center-tier-standards>

**Frameworks de arquitetura cloud:**

- **AWS Well-Architected Framework — página principal**: <https://aws.amazon.com/architecture/well-architected/>
- **AWS Well-Architected — os 6 pilares**: <https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html>
- **AWS Well-Architected Reliability Pillar** (whitepaper atualizado, nov/2024): <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html>
- **Microsoft Cloud Adoption Framework for Azure** (página principal): <https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/>
- **Microsoft CAF — Overview**: <https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/overview>

**Vídeos recomendados:**

- *IaaS, PaaS e SaaS na Computação em Nuvem* (Prof. Rodrigo Schaeffer, PT-BR, foco em concurso): <https://www.youtube.com/watch?v=5czsMlRc7Wk>
- *Questão sobre Computação em Nuvem IaaS, PaaS e SaaS* (mesmo canal, resolução comentada): <https://www.youtube.com/watch?v=zaKt2EbZkHE>
- *PAAS, SAAS E IAAS — entenda a diferença* (PT-BR, visão executiva): <https://www.youtube.com/watch?v=NxqkWORv2UQ>
- *Data Center Tiers: Understanding Uptime Institute Standards* (inglês, explicativo): <https://www.youtube.com/watch?v=0acbHqkQe80>
- *Uptime Data Center Tier Levels — The Gold Standard* (AKCP, inglês): <https://www.youtube.com/watch?v=8DzqbL0HKG0>

---

## Módulo 3 — Infraestrutura Hiperconvergente (HCI)

### Conceitos que você precisa dominar

**Evolução da infraestrutura:**

1. **Tradicional (3-tier):** servidores + switches SAN/LAN + storage array separados. Silos operacionais, escala independente.
2. **Convergente:** mesmos componentes, mas **pré-integrados e validados** pelo fornecedor (ex.: VCE Vblock, FlexPod, HPE ConvergedSystem). Continua sendo hardware separado.
3. **Hiperconvergente (HCI):** compute, storage e (às vezes) rede **integrados em software** num mesmo nó x86. Storage distribuído por software (SDS) entre os nós.
4. **Desagregada / Composable:** compute e storage em pools separados, mas conectados por alta velocidade (NVMe-oF). Escala independente + flexibilidade do SDS.

**Características marcantes de HCI:**

- **Scale-out:** adiciona-se nó, aumenta compute **e** storage simultaneamente.
- **Software-Defined Storage (SDS):** storage é um serviço de software sobre discos locais, replicado entre nós.
- **Gerência unificada:** um único plano de controle (ex.: Nutanix Prism, vCenter + vSAN).
- **Simplicidade operacional** × **acoplamento compute/storage** (escala-se junto mesmo quando só um é necessário).

**Principais fornecedores (cai em prova):**

- **Nutanix** (AHV, AOS, Prism).
- **VMware vSAN** (dentro do vSphere).
- **Dell VxRail** (baseado em vSAN).
- **Cisco HyperFlex**.
- **HPE SimpliVity**.
- **Microsoft Azure Stack HCI**.

### Fontes oficiais (com links)

- **Nutanix Cloud Bible** (referência técnica gratuita, a mais completa): <https://www.nutanixbible.com/>
- **Nutanix Cloud Bible — PDF completo**: <https://www.nutanixbible.com/pdf/nutanix_cloud_bible_classic_edition.pdf>
- **Nutanix — What is HCI (FAQ)**: <https://www.nutanix.com/hyperconverged-infrastructure>
- **IBM — What is Hyperconverged Infrastructure?**: <https://www.ibm.com/think/topics/hyperconverged-infrastructure>
- **Red Hat — O que é infraestrutura hiperconvergente** (em inglês, mas direto): <https://www.redhat.com/en/topics/hyperconverged-infrastructure/what-is-hyperconverged-infrastructure>

**Vídeos recomendados:**

- *O que é uma infraestrutura hiperconvergente (HCI)?* (VMware Brasil, PT-BR, ~3 min): <https://www.youtube.com/watch?v=eMYVsrbn1dg>
- *Infraestrutura Hiperconvergente: Descomplicando o HCI, 3 em 1!* (PT-BR): <https://www.youtube.com/watch?v=MmPse626HZw>
- *O que, afinal, é Hiperconvergência?* (Cisco Brasil, entrevista com especialistas, PT-BR): <https://www.youtube.com/watch?v=W79JWpU9gOs>

---

## Módulo 4 — Escalabilidade, tolerância a falhas e redundância

### 4.1 Escalabilidade

| Abordagem | O que é | Quando usar | Limite |
|-----------|---------|-------------|--------|
| **Scale-up (vertical)** | Aumentar recursos do mesmo nó (mais CPU/RAM) | Workloads monolíticas, bancos relacionais tradicionais | Limite físico do hardware |
| **Scale-out (horizontal)** | Adicionar mais nós | Web apps stateless, NoSQL, HCI, microsserviços | Em teoria, linear; na prática, limitado por overhead de coordenação |

**Conceitos relacionados:**

- **Stateless × stateful:** apps stateless escalam horizontalmente com facilidade; stateful exigem replicação/sharding de estado.
- **Auto scaling:** criação automática de instâncias conforme métricas (CPU, fila, latência). Essencial em cloud.
- **Elasticidade:** capacidade de expandir **e contrair** sob demanda. Diferente de "escalabilidade" pura, que só fala do crescimento.

### 4.2 Tolerância a falhas e redundância

**SPOF (Single Point of Failure):** qualquer componente cuja falha derruba o sistema inteiro. Projetos de alta disponibilidade começam por **mapear e eliminar SPOFs**.

**Métricas fundamentais:**

- **MTBF (Mean Time Between Failures):** tempo médio entre falhas. Maior = melhor.
- **MTTR (Mean Time To Repair/Restore):** tempo médio para reparar. Menor = melhor.
- **MTTF (Mean Time To Failure):** para componentes não-reparáveis (ex.: HDs descartáveis).
- **Availability = MTBF / (MTBF + MTTR)**

**Disponibilidade em "9s":**

| % | Downtime/ano | Downtime/mês |
|---|-------------|--------------|
| 99%       | 3,65 dias   | 7,2 h  |
| 99,9%     | 8,76 h      | 43,8 min |
| 99,99%    | 52,56 min   | 4,38 min |
| 99,999%   | 5,26 min    | 26,3 s |
| 99,9999%  | 31,5 s      | 2,6 s |

> **Dica de memorização:** cada "9" a mais divide o downtime por ~10.

**Estratégias de redundância:**

- **Ativo-ativo:** todos os nós processam tráfego. Balanceamento de carga + failover. Maior aproveitamento.
- **Ativo-passivo:** apenas um nó processa; outro(s) aguardam. Mais simples, menos eficiente.
- **N+1 / 2N:** ver seção de Tiers.
- **Load balancing:** L4 (IP/porta — rápido) × L7 (URL/cookie/header — stateful, mais flexível).
- **Clustering:** grupo de servidores que se apresentam como um só (Pacemaker, Windows Failover Cluster).
- **Geo-redundância:** replicação entre regiões/sites.

### 4.3 Princípios de design

Do **AWS Well-Architected Reliability Pillar** e do **Google SRE Book**:

- **Design for failure:** assuma que tudo falha; projete para continuar funcionando mesmo assim.
- **Loose coupling** e **filas assíncronas** entre componentes.
- **Stateless services** sempre que possível.
- **Health checks + automação de recuperação** (self-healing).
- **Graceful degradation:** degradação parcial é melhor que queda total (ex.: retornar cache desatualizado em vez de erro).

### Fontes oficiais (com links)

- **Google SRE Book — índice completo** (gratuito, online): <https://sre.google/sre-book/table-of-contents/>
- **Google SRE — página principal dos livros**: <https://sre.google/books/>
- **Google SRE Workbook — índice** (companion prático): <https://sre.google/workbook/table-of-contents/>
- **AWS Well-Architected — Reliability Pillar (whitepaper)**: <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html>
- **AWS Reliability — Design Principles**: <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html>
- **AWS — Uptime Institute (posição da AWS sobre Tiers)**: <https://aws.amazon.com/compliance/uptimeinstitute/>

---

## Pegadinhas CESPE típicas neste tópico

1. **"Topologia física e lógica são equivalentes."** → Errado. Em Ethernet switched, física é estrela e lógica é broadcast.
2. **"Leaf-spine é mais adequada para tráfego north-south."** → Errado. É projetada para east-west.
3. **"Tier IV exige apenas redundância N+1."** → Errado. Tier IV exige **2N ou 2(N+1)** e *fault tolerance*.
4. **"Nuvem híbrida é o mesmo que multicloud."** → Errado. Híbrida = privada + pública integradas; multicloud = múltiplas públicas.
5. **"No modelo IaaS, o provedor é responsável pelo patch do sistema operacional guest."** → Errado. IaaS: cliente cuida do SO.
6. **"HCI elimina completamente o acoplamento entre compute e storage."** → Errado. HCI **acopla** os dois no mesmo nó; desagregada/composable é que desacopla.
7. **"Escalabilidade horizontal (scale-out) tem como vantagem o limite físico do hardware."** → Errado. O limite físico é característica do scale-up.
8. **"SPOF é aceitável em Tier III desde que haja manutenção programada."** → Errado. Tier III já requer ausência de SPOF para manutenção concorrente; redundância é estrutural.
9. **"Uma disponibilidade de 99,99% corresponde a cerca de 8 horas de indisponibilidade por ano."** → Errado. 99,99% ≈ 52 minutos/ano. 8 horas/ano ≈ 99,9%.
10. **"MTBF mede o tempo para reparar um componente."** → Errado. Isso é MTTR.

---

## Entregáveis ao fim da semana

1. **Mapa mental** (Miro, Xmind ou papel) conectando: topologias → arquiteturas de DC → HCI → princípios de escalabilidade/redundância.
2. **Tabela comparativa** on-prem × cloud pública × híbrida (colunas: custo inicial, OpEx/CapEx, controle, escalabilidade, latência, responsabilidade de segurança).
3. **Diagrama leaf-spine** simples (4 leafs, 2 spines) com cálculo de enlaces e justificativa do uso.
4. **20 questões CESPE** resolvidas (use o agente gerador do projeto; peça um mix de Certo/Errado e múltipla escolha).
5. **Lista pessoal de erros** — anote conceitos que confundiu; revisite antes da Semana 2.

---

## Checklist de autoavaliação (responda sem consultar)

- [ ] Qual a diferença entre topologia física e lógica? Dê um exemplo onde elas divergem.
- [ ] Em que tipo de tráfego a topologia leaf-spine é superior à three-tier? Por quê?
- [ ] Quais são os quatro Tiers do Uptime Institute e suas diferenças essenciais?
- [ ] Em IaaS, quem é responsável por aplicar patch no SO guest? E em PaaS? E em SaaS?
- [ ] O que é o modelo de responsabilidade compartilhada em cloud?
- [ ] Qual a diferença entre arquitetura convergente e hiperconvergente?
- [ ] O que significa N+1, 2N e 2(N+1)?
- [ ] Quantos minutos/ano equivale 99,99% de disponibilidade?
- [ ] Qual a fórmula da availability em função de MTBF e MTTR?
- [ ] Qual a diferença entre híbrida e multicloud?

Se errou 3 ou mais, **revise os módulos correspondentes antes de avançar** para a Semana 2.

---

## Recursos complementares (se sobrar tempo)

- **Lab:** Simular uma topologia leaf-spine simples no **GNS3** (<https://www.gns3.com/>) ou **Containerlab** (<https://containerlab.dev/>) com 2 spines + 4 leafs.
- **Podcast:** *Packet Pushers — Heavy Networking* (episódios sobre DC fabrics): <https://packetpushers.net/series/weekly-show/>
- **Leitura complementar:** *Top-Down Network Design* (Priscilla Oppenheimer) — livro, capítulos iniciais sobre topologias e design hierárquico.

---

## Bibliografia e playlists consolidadas

### 📄 Leitura essencial (priorize nesta ordem)

| # | Documento | Link | Tempo estimado |
|---|-----------|------|----------------|
| 1 | NIST SP 800-145 — Definition of Cloud Computing (PDF, 7 pg) | <https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-145.pdf> | 20 min |
| 2 | Uptime Institute — Tier Classification | <https://uptimeinstitute.com/tiers> | 15 min |
| 3 | Uptime Institute — Explicação detalhada dos Tiers | <https://journal.uptimeinstitute.com/explaining-uptime-institutes-tier-classification-system/> | 20 min |
| 4 | Cisco — Spine-and-Leaf Architecture (whitepaper oficial) | <https://cisco-apps.cisco.com/c/en/us/products/collateral/switches/nexus-7000-series-switches/white-paper-c11-737022.html> | 45 min |
| 5 | AWS Well-Architected — Reliability Pillar | <https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html> | 1 h |
| 6 | AWS Well-Architected — 6 pilares (visão geral) | <https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html> | 20 min |
| 7 | Microsoft Cloud Adoption Framework | <https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/overview> | 40 min |
| 8 | Nutanix Cloud Bible (seção "The Basics") | <https://www.nutanixbible.com/> | 1 h |
| 9 | Google SRE Book — capítulos 1 a 3 | <https://sre.google/sre-book/table-of-contents/> | 1,5 h |

### 📄 Leitura de apoio (didática, leitura leve)

| Documento | Link |
|-----------|------|
| Google Cloud — PaaS vs IaaS vs SaaS (comparativo com analogias) | <https://cloud.google.com/learn/paas-vs-iaas-vs-saas> |
| IBM — IaaS, PaaS, SaaS: What's the difference? | <https://www.ibm.com/think/topics/iaas-paas-saas> |
| IBM — What is Hyperconverged Infrastructure? | <https://www.ibm.com/think/topics/hyperconverged-infrastructure> |
| Nutanix — What is HCI (FAQ) | <https://www.nutanix.com/hyperconverged-infrastructure> |
| Red Hat — What is Hyperconverged Infrastructure | <https://www.redhat.com/en/topics/hyperconverged-infrastructure/what-is-hyperconverged-infrastructure> |
| Red Hat — Spine-leaf networking (OpenStack context) | <https://docs.redhat.com/en/documentation/red_hat_openstack_platform/17.1/html/configuring_spine-leaf_networking/assembly_introduction-to-spine-leaf-networking> |
| TechTarget — Uptime Institute Tiers (visão prática) | <https://www.techtarget.com/searchdatacenter/definition/Uptime-data-center-tier-standards> |
| NetworkLessons — Spine and Leaf Architecture | <https://networklessons.com/network-fundamentals/spine-and-leaf-architecture> |
| NetworkAcademy.IO — Leaf-Spine Architecture | <https://www.networkacademy.io/ccna/network-fundamentals/leaf-spine-architecture> |
| 9tut — Spine-Leaf Tutorial (estilo CCNA) | <https://www.9tut.com/spine-leaf-architecture-tutorial> |

### 🎥 Playlist sugerida de vídeos (ordem recomendada)

**Bloco 1 — Cloud e modelos de serviço (PT-BR, foco em concurso)**

1. *IaaS, PaaS e SaaS na Computação em Nuvem* (Prof. Rodrigo Schaeffer): <https://www.youtube.com/watch?v=5czsMlRc7Wk>
2. *Questão sobre Computação em Nuvem IaaS, PaaS e SaaS* (questão CESPE resolvida): <https://www.youtube.com/watch?v=zaKt2EbZkHE>
3. *PAAS, SAAS E IAAS, entenda a diferença*: <https://www.youtube.com/watch?v=NxqkWORv2UQ>
4. *Diferenças entre IaaS PaaS e SaaS | Cloud Computing*: <https://www.youtube.com/watch?v=Hgeo2i_P5y8>

**Bloco 2 — Data Center Tiers (Uptime Institute)**

5. *Data Center Tiers: Understanding Uptime Institute Standards* (EN): <https://www.youtube.com/watch?v=0acbHqkQe80>
6. *Uptime Data Center Tier Levels — The Gold Standard* (EN, AKCP): <https://www.youtube.com/watch?v=8DzqbL0HKG0>

**Bloco 3 — Hiperconvergência (PT-BR)**

7. *O que é uma infraestrutura hiperconvergente (HCI)?* (VMware Brasil, ~3 min): <https://www.youtube.com/watch?v=eMYVsrbn1dg>
8. *Infraestrutura Hiperconvergente: Descomplicando o HCI, 3 em 1!*: <https://www.youtube.com/watch?v=MmPse626HZw>
9. *O que, afinal, é Hiperconvergência?* (Cisco Brasil, formato podcast): <https://www.youtube.com/watch?v=W79JWpU9gOs>

**Bloco 4 — Topologias de data center (EN, nível CCNA/CCNP)**

10. *Spine and Leaf network architecture explained | CCNA 200-301* (David Bombal): <https://www.youtube.com/watch?v=xjc7WLBb-nI>
11. *What is Spine leaf architectures | CCNA* (Network Zeal): <https://www.youtube.com/watch?v=GEMzMIFapeA>
12. *Spine and Leaf Design: Cisco ACI*: <https://www.youtube.com/watch?v=LYWMPE86EiQ>

### ⚙️ Ferramentas de lab

- **GNS3** (simulação de redes): <https://www.gns3.com/>
- **Containerlab** (labs de redes baseados em containers): <https://containerlab.dev/>
- **AWS Free Tier**: <https://aws.amazon.com/free/>
- **Azure Free Account**: <https://azure.microsoft.com/en-us/free/>
- **Oracle Cloud Always Free**: <https://www.oracle.com/cloud/free/>

