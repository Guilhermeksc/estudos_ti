import { KnowledgeArea } from '../models/knowledge.model';

export const KNOWLEDGE_CATALOG: KnowledgeArea[] = [
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
    ferramentas: ['Linux', 'Windows Server', 'KVM', 'VMware vSphere/ESXi', 'Zabbix', 'Grafana', 'New Relic', 'Nginx/HAProxy', 'Bash', 'PowerShell', 'Puppet'],
    materiais: [
      {
        title: 'Tópico 1: Arquitetura de Infraestrutura de TI',
        url: '/roteiro_topico1_arquitetura_infra(2).md'
      }
    ]
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
      'Arquitetura e gestão de dados com DAMA DMBoK',
      'Data Warehouse, Data Mart, Data Lake, Data Mesh e modelagem dimensional',
      'SQL, Oracle PL/SQL, otimização de consultas e mapeamento objeto-relacional',
      'NoSQL, indexação de conteúdo e elastic search',
      'Sistemas de suporte à decisão analítica: BI, OLAP, Data Mining e ERP',
      'Metadados, MDM, ontologias e ECM'
    ],
    ferramentas: ['Oracle Database', 'Microsoft SQL Server', 'MongoDB', 'Elasticsearch', 'Liquibase', 'ETL', 'Data Warehouse', 'Data Lake', 'OLAP', 'Parquet']
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
      'Desenvolvimento seguro',
      'Processos de software: UP, Scrum, XP, Kanban e Lean',
      'Engenharia de requisitos: histórias de usuário, casos de uso e gestão de requisitos',
      'Gestão de backlog, dívida técnica, priorização e estimativas (PF e story points)',
      'Modelos de software: E-R, UML e engenharia reversa',
      'Princípios de projeto: acoplamento, coesão, SOLID, padrões e code smells',
      'Qualidade de software: métricas, análise estática/dinâmica e padronização',
      'Arquitetura de software: camadas, microsserviços, eventos, hexagonal e serverless',
      'Desenvolvimento de software com Java, TypeScript, Angular e Python',
      'Integração de sistemas com REST, mensageria, JSON, XML e gRPC',
      'Testes de unidade, integração e sistema; TDD, xUnit, mocks e stubs',
      'Gerência de configuração: Git, Gitflow, versionamento semântico e release management',
      'DevOps: CI/CD, feature flags, deploy canário/A-B e observabilidade'
    ],
    ferramentas: ['Java', 'Spring Boot', 'Spring Cloud', 'JPA', 'TypeScript', 'Angular', 'Python', 'Maven', 'npm', 'Git', 'Gitflow', 'xUnit']
  },
  {
    slug: 'seguranca-informacao',
    title: 'Segurança da Informação',
    description: 'Segurança aplicada a identidade, aplicações, infraestrutura, dados e conformidade regulatória.',
    subareas: [
      'Gestão de identidades e acesso',
      'Privacidade e segurança por padrão',
      'Malware e ameaças',
      'Controles e testes para aplicações web',
      'Múltiplos fatores de autenticação',
      'Soluções de segurança da informação',
      'Frameworks de segurança cibernética',
      'Tratamento de incidentes cibernéticos',
      'Criptografia e certificação digital',
      'Segurança em nuvem e contêineres',
      'Ataques a redes e aplicações',
      'OWASP, CIS Controls e desenvolvimento seguro',
      'SAML, OAuth2, OpenID Connect e login social',
      'SSL, mTLS, gestão de segredos e zero-trust security',
      'Mascaramento de dados, LGPD e privacidade by design',
      'Direito digital: Marco Civil, crimes cibernéticos, direito de resposta e proteção de dados'
    ],
    ferramentas: ['OWASP', 'CIS Controls', 'SIEM', 'IDS/IPS', 'Firewall', 'IAM', 'PAM', 'MFA', 'SAML', 'OAuth2', 'OpenID Connect', 'mTLS']
  },
  {
    slug: 'computacao-nuvem',
    title: 'Computação em Nuvem',
    description: 'Arquitetura, operação e governança de soluções cloud em cenários híbridos e multicloud.',
    subareas: [
      'Fundamentos de computação em nuvem',
      'Plataformas e serviços AWS, Azure e GCP',
      'Arquitetura de soluções em nuvem',
      'Redes e segurança em nuvem',
      'DevOps, CI/CD e infraestrutura como código',
      'Governança, compliance e custos',
      'Armazenamento e processamento de dados',
      'Migração e modernização de aplicações',
      'Multicloud e nuvem soberana',
      'Normas de nuvem no governo federal',
      'Modelo dos 12 fatores para aplicações cloud-native',
      'Estratégias de migração para nuvem e modernização de legado',
      'SaaS, PaaS e IaaS com análise de custo e bilhetagem',
      'Containers e orquestração para arquitetura distribuída',
      'CDN, autoescalonamento e resiliência em sistemas web'
    ],
    ferramentas: ['AWS', 'Microsoft Azure', 'Google Cloud Platform', 'Terraform', 'Docker', 'Kubernetes', 'CDN', 'CloudWatch', 'Azure Monitor', 'GCP Monitoring']
  },
  {
    slug: 'inteligencia-artificial',
    title: 'Inteligência Artificial',
    description: 'Fundamentos, aplicações e governança de IA para cenários de dados, automação e decisão.',
    subareas: [
      'Aprendizado de máquina',
      'Redes neurais e deep learning',
      'Processamento de linguagem natural',
      'Inteligência artificial generativa',
      'Arquitetura e engenharia de sistemas de IA',
      'Ética, transparência e responsabilidade em IA',
      'Chatbots e aplicações práticas com NLP',
      'MLOps e integração de modelos com plataformas de nuvem',
      'IA aplicada a ciência de dados e sistemas analíticos',
      'Blockchain: conceitos e aplicações em trilhas de inovação'
    ],
    ferramentas: ['Machine Learning', 'Deep Learning', 'NLP', 'MLOps', 'Chatbots', 'Data Mining', 'Big Data', 'Blockchain']
  },
  {
    slug: 'contratacoes-ti',
    title: 'Contratações de TI',
    description: 'Planejamento, aquisição e fiscalização de contratos de TI com foco em normativos e controle público.',
    subareas: [
      'Etapas da contratação de soluções de TI',
      'Tipos de soluções e modelos de serviço',
      'Governança, fiscalização e gestão de contratos',
      'Riscos e controles em contratações',
      'Aspectos técnicos e estratégicos',
      'Legislação e normativos aplicáveis',
      'Lei 14.133/2021 e instruções normativas SGD/ME e SEGES/ME',
      'Critérios de remuneração por esforço versus produto',
      'SLA/ANS, indicadores e penalidades administrativas',
      'Papel do fiscal do contrato e do preposto da contratada',
      'UST, Pontos de Função e postos de trabalho com nível de serviço',
      'Análise de alternativas, ROI, TCO e construir x comprar',
      'Provas de conceito e especificação de serviços de sustentação/consultoria'
    ],
    ferramentas: ['Lei 14.133/2021', 'IN SGD/ME 01/2019', 'IN SGD/ME 40/2020', 'IN SEGES/ME 65/2021', 'UST', 'Pontos de Função', 'SLA/ANS', 'RACI']
  },
  {
    slug: 'gestao-ti',
    title: 'Gestão de Tecnologia da Informação',
    description: 'Governança, estratégia, processos e gestão de serviços, produtos e times de tecnologia.',
    subareas: [
      'ITIL v4',
      'COBIT 5',
      'Metodologias ágeis: Scrum, XP, Kanban, TDD, BDD e DDD',
      'Gestão e planejamento estratégico de TI',
      'PDCA, BSC, SWOT, cenários e matriz GUT',
      'PDTI, PETI e indicadores de desempenho de TI',
      'PMBoK e gestão de projetos de tecnologia',
      'Modelagem de processos e serviços com BPMN e workflow',
      'Análise de negócio, design thinking e business canvas',
      'Governança de dados e gestão de riscos de TI',
      'Gestão de produtos, liderança, feedback e comunicação'
    ],
    ferramentas: ['ITIL', 'COBIT 5', 'PMBoK', 'BPMN', 'PDCA', 'Balanced Scorecard', 'SWOT', 'Matriz GUT', 'PETI', 'PDTI']
  },
  {
    slug: 'analise-negocio-processos',
    title: 'Análise de Negócio e de Processos',
    description: 'Modelagem e redesenho de processos para alinhamento entre estratégia, operação e transformação digital.',
    subareas: [
      'Arquitetura corporativa',
      'Modelagem, análise e redesenho de processos',
      'BPMN e workflow',
      'Modelagem conceitual',
      'Design thinking e business canvas',
      'Transformação digital, governo eletrônico e cidadania digital'
    ],
    ferramentas: ['BPMN', 'Workflow', 'Business Canvas', 'Design Thinking', 'Arquitetura Corporativa']
  },
  {
    slug: 'aquisicao-solucoes-ti',
    title: 'Aquisição de Soluções de TI',
    description: 'Avaliação técnica e econômica para contratação de soluções e serviços de TI no setor público.',
    subareas: [
      'Análise de alternativas e custo x benefício',
      'Construir x comprar',
      'ROI e custo total de propriedade (TCO)',
      'Provas de conceito (PoC)',
      'Pesquisa e especificação de sustentação e consultoria',
      'Legislação de compras públicas para TI'
    ],
    ferramentas: ['ROI', 'TCO', 'PoC', 'Termo de Referência', 'Matriz de Alternativas']
  },
  {
    slug: 'engenharia-requisitos',
    title: 'Engenharia de Requisitos',
    description: 'Elicitação, especificação e gestão de requisitos com foco em valor de produto, UX e qualidade.',
    subareas: [
      'Elicitação e gestão de requisitos',
      'Histórias de usuário e casos de uso',
      'Privacidade e segurança por padrão e por projeto',
      'Design de interface e experiência do usuário',
      'Responsividade, usabilidade e acessibilidade',
      'Prototipação, MVP e testes A/B'
    ],
    ferramentas: ['User Stories', 'Casos de Uso', 'Protótipos', 'MVP', 'Testes A/B']
  },
  {
    slug: 'desenvolvimento-containers',
    title: 'Desenvolvimento com Containers',
    description: 'Construção e operação de aplicações distribuídas com containers e orquestração.',
    subareas: [
      'Docker e OCI',
      'Boas práticas de desenvolvimento com containers',
      'Orquestração com Kubernetes',
      'Arquitetura altamente distribuída',
      'Content Delivery Networks (CDNs)',
      'Observabilidade em ambientes containerizados'
    ],
    ferramentas: ['Docker', 'OCI', 'Kubernetes', 'CDN', 'Container Registry']
  },
  {
    slug: 'integracao-sistemas',
    title: 'Integração de Sistemas',
    description: 'Integração síncrona e assíncrona entre aplicações com APIs, eventos e troca de dados padronizada.',
    subareas: [
      'Padrões de integração de aplicações',
      'REST e web services',
      'Projeto e versionamento de APIs',
      'Comunicação síncrona e assíncrona',
      'Mensageria e orientação a eventos',
      'JSON, XML e gRPC',
      'Sincronização de dados e integridade eventual'
    ],
    ferramentas: ['REST', 'Web Services', 'Mensageria', 'gRPC', 'JSON', 'XML']
  },
  {
    slug: 'devops',
    title: 'DevOps',
    description: 'Cultura e práticas para entrega contínua, confiabilidade e operação de software em produção.',
    subareas: [
      'Conceitos e princípios DevOps',
      'Integração contínua e entrega contínua',
      'Feature flags e estratégias de deploy A/B e canário',
      'Observabilidade: logs, métricas e tracing',
      'Automação com scripting em shell e Ruby',
      'Operação em ambiente Linux'
    ],
    ferramentas: ['CI/CD', 'Feature Flags', 'Deploy Canário', 'Shell Script', 'Linux', 'Observabilidade']
  },
  {
    slug: 'seguranca-informacao-materia',
    title: 'Segurança da Informação (Matéria)',
    description: 'Controles e práticas de segurança aplicadas ao desenvolvimento, identidade, proteção de dados e conformidade.',
    subareas: [
      'Tipos de ataques e vulnerabilidades',
      'Desenvolvimento seguro e boas práticas OWASP',
      'Modelo de Controles CIS',
      'IAM, autenticação, autorização e SSO',
      'SAML, OAuth2, OpenID Connect e login social',
      'Criptografia, SSL, mTLS e certificação digital',
      'Gestão de segredos e zero-trust security',
      'LGPD e privacidade por padrão'
    ],
    ferramentas: ['OWASP', 'CIS Controls', 'IAM', 'SSO', 'SAML', 'OAuth2', 'OpenID Connect', 'SSL', 'mTLS']
  },
  {
    slug: 'direito-digital',
    title: 'Direito Digital',
    description: 'Aspectos legais da tecnologia, privacidade, responsabilidade civil e legislação aplicada ao ambiente digital.',
    subareas: [
      'Proteção de dados e privacidade da informação',
      'Responsabilidade de provedores, usuários e empresas',
      'Quebra de sigilo telemático',
      'Redes sociais, remoção de conteúdo e direito ao esquecimento',
      'Lei 9.609/1998 (software)',
      'Lei 12.737/2012 (crimes cibernéticos)',
      'Lei 12.965/2014 (Marco Civil da Internet)',
      'Lei 13.188/2015 (direito de resposta)',
      'Lei 13.709/2018 (LGPD)'
    ],
    ferramentas: ['LGPD', 'Marco Civil da Internet', 'ICP-Brasil', 'Compliance', 'Gestão de Riscos Jurídicos']
  }
];
