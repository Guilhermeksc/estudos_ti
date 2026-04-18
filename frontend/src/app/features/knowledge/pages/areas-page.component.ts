import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { KnowledgeCatalogService } from '../services/knowledge-catalog.service';

@Component({
  selector: 'app-areas-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './areas-page.component.html',
  styleUrl: './areas-page.component.scss'
})
export class AreasPageComponent {
  private readonly catalogService = inject(KnowledgeCatalogService);
  protected readonly areas = this.catalogService.getAreas();
}
