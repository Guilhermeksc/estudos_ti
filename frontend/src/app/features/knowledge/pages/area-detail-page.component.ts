import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { KnowledgeCatalogService } from '../services/knowledge-catalog.service';

@Component({
  selector: 'app-area-detail-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './area-detail-page.component.html',
  styleUrl: './area-detail-page.component.scss'
})
export class AreaDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogService = inject(KnowledgeCatalogService);

  protected readonly area = computed(() => {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    return this.catalogService.getAreaBySlug(slug);
  });
}
