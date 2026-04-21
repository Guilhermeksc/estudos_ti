import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { marked } from 'marked';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private readonly http = inject(HttpClient);

  async parseFromUrl(url: string): Promise<string> {
    try {
      const rawMarkdown = await firstValueFrom(
        this.http.get(url, { responseType: 'text' })
      );
      return marked.parse(rawMarkdown, { async: false }) as string;
    } catch (error) {
      console.error('Error fetching or parsing markdown:', error);
      return '<p>Erro ao carregar o conteúdo do material.</p>';
    }
  }
}
