import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TiMateriasService } from '../../../core/services/ti-materias.service';
import { TiMateriaCard } from '../../../interfaces/ti.interface';

@Component({
  selector: 'app-ti-materias-cards-page',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './ti-materias-cards-page.component.html',
  styleUrl: './ti-materias-cards-page.component.scss'
})
export class TiMateriasCardsPageComponent implements OnInit {
  private readonly service = inject(TiMateriasService);
  private readonly fb = inject(FormBuilder);

  protected readonly cards = signal<TiMateriaCard[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showModal = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);
  protected readonly saveSuccess = signal(false);

  protected readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
    descricao: ['', [Validators.required, Validators.minLength(10)]],
    areaSlug: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
    ordem: [10],
    ativo: [true]
  });

  ngOnInit(): void {
    this.loadCards();
  }

  protected loadCards(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.listarCards().subscribe({
      next: (data) => {
        this.cards.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[TiMateriasCards] erro ao carregar cards:', err);
        this.error.set('Não foi possível carregar as matérias. Verifique a conexão com a API.');
        this.loading.set(false);
      }
    });
  }

  protected openModal(): void {
    this.form.reset({ ativo: true, ordem: 10 });
    this.saveError.set(null);
    this.saveSuccess.set(false);
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
  }

  protected onTituloBlur(): void {
    const titulo = this.form.get('titulo')?.value ?? '';
    if (titulo && !this.form.get('slug')?.dirty) {
      const slug = titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      this.form.get('slug')?.setValue(slug);
    }
  }

  protected submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    const raw = this.form.getRawValue();
    this.service
      .criar({
        titulo: raw.titulo!,
        slug: raw.slug!,
        descricao: raw.descricao!,
        areaSlug: raw.areaSlug!,
        ordem: raw.ordem ?? 10,
        ativo: raw.ativo ?? true
      })
      .subscribe({
        next: () => {
          this.saveSuccess.set(true);
          this.saving.set(false);
          this.loadCards();
          setTimeout(() => this.closeModal(), 1500);
        },
        error: (err) => {
          console.error('[TiMateriasCards] erro ao criar matéria:', err);
          this.saveError.set('Erro ao salvar. Verifique os dados e tente novamente.');
          this.saving.set(false);
        }
      });
  }

  protected trackByCard(_: number, card: TiMateriaCard): number {
    return card.id;
  }
}
