import { Injectable } from '@angular/core';

import { KNOWLEDGE_CATALOG } from '../data/knowledge-catalog';
import { KnowledgeArea } from '../models/knowledge.model';

@Injectable({ providedIn: 'root' })
export class KnowledgeCatalogService {
  getAreas(): KnowledgeArea[] {
    return KNOWLEDGE_CATALOG;
  }

  getAreaBySlug(slug: string): KnowledgeArea | undefined {
    return KNOWLEDGE_CATALOG.find((area) => area.slug === slug);
  }
}
