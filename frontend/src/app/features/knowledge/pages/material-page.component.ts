import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { KnowledgeCatalogService } from '../services/knowledge-catalog.service';
import { MarkdownService } from '../services/markdown.service';

@Component({
  selector: 'app-material-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './material-page.component.html',
  styleUrl: './material-page.component.scss'
})
export class MaterialPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogService = inject(KnowledgeCatalogService);
  private readonly markdownService = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);

  htmlContent = signal<SafeHtml | null>(null);
  materialTitle = signal<string>('');
  areaSlug = signal<string>('');

  async ngOnInit() {
    this.areaSlug.set(this.route.snapshot.paramMap.get('slug') ?? '');
    const materialIndexParam = this.route.snapshot.paramMap.get('materialIndex');
    
    if (!this.areaSlug() || !materialIndexParam) {
      this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml('<p>Material não encontrado.</p>'));
      return;
    }

    const area = this.catalogService.getAreaBySlug(this.areaSlug());
    if (!area || !area.materiais) {
      this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml('<p>Material não encontrado.</p>'));
      return;
    }

    const materialIndex = parseInt(materialIndexParam, 10);
    const material = area.materiais[materialIndex];

    if (!material) {
      this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml('<p>Material não encontrado.</p>'));
      return;
    }

    this.materialTitle.set(material.title);
    
    const parsedHtml = await this.markdownService.parseFromUrl(material.url);
    this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(parsedHtml));
  }
}
