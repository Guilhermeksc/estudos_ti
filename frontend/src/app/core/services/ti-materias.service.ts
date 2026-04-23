import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../utils/api-url';
import { TiMateria, TiMateriaCard, TiMateriaCreatePayload } from '../../interfaces/ti.interface';

@Injectable({ providedIn: 'root' })
export class TiMateriasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = apiUrl('/api/ti/materias');

  listarCards(): Observable<TiMateriaCard[]> {
    return this.http.get<TiMateriaCard[]>(`${this.baseUrl}/cards`);
  }

  listar(): Observable<TiMateria[]> {
    return this.http.get<TiMateria[]>(this.baseUrl);
  }

  buscar(id: number): Observable<TiMateria> {
    return this.http.get<TiMateria>(`${this.baseUrl}/${id}`);
  }

  criar(payload: TiMateriaCreatePayload): Observable<TiMateria> {
    return this.http.post<TiMateria>(this.baseUrl, payload);
  }

  atualizar(id: number, payload: TiMateriaCreatePayload): Observable<TiMateria> {
    return this.http.put<TiMateria>(`${this.baseUrl}/${id}`, payload);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
