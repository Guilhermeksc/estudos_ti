import { environment } from '../../../environments/environment';

/** Monta URL da API: dev relativo `/api/...`; prod `https://api.../api/...`. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = environment.apiBaseUrl.trim().replace(/\/$/, '');
  return base ? `${base}${normalized}` : normalized;
}
