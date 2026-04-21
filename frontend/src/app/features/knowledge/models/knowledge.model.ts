export interface KnowledgeArea {
  slug: string;
  title: string;
  description: string;
  subareas: string[];
  ferramentas: string[];
  materiais?: { title: string; url: string }[];
}
