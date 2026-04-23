import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthUser {
  sub: string;
  username: string;
  email: string;
  name: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser | null;
}

@Injectable({ providedIn: 'root' })
export class CemosAuthService {
  private readonly http = inject(HttpClient);

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      '/api/auth/login',
      { username, password },
      { withCredentials: true }
    );
  }

  refresh(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/refresh', {}, { withCredentials: true });
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/logout', {}, { withCredentials: true });
  }

  me(): Observable<{ user: AuthUser }> {
    return this.http.get<{ user: AuthUser }>('/api/auth/me', { withCredentials: true });
  }
}
