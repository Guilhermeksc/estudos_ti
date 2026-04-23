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

export interface OAuthTokenFragment {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  token_type?: string;
}

interface JwtPayload {
  sub?: string;
  preferred_username?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

@Injectable({ providedIn: 'root' })
export class CemosAuthService {
  private readonly http = inject(HttpClient);
  private readonly socialAuthBaseUrl = 'https://cemos2028.com';

  loginWithProvider(provider: 'google', returnUrl: string): void {
    const params = new URLSearchParams({ returnUrl });
    window.location.href = `${this.socialAuthBaseUrl}/api/auth/oauth2/${provider}?${params.toString()}`;
  }

  buildLoginResponseFromOAuth(tokens: OAuthTokenFragment): LoginResponse {
    const payload = this.decodeJwtPayload(tokens.access_token);

    return {
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in ?? 300,
      user: this.buildUserFromPayload(payload)
    };
  }

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

  private decodeJwtPayload(token: string): JwtPayload {
    try {
      const [, payload] = token.split('.');
      if (!payload) {
        return {};
      }

      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );

      return JSON.parse(json) as JwtPayload;
    } catch {
      return {};
    }
  }

  private buildUserFromPayload(payload: JwtPayload): AuthUser | null {
    if (!payload.sub && !payload.preferred_username && !payload.email) {
      return null;
    }

    const resourceRoles = Object.values(payload.resource_access ?? {}).flatMap((access) => access.roles ?? []);
    const roles = [...new Set([...(payload.realm_access?.roles ?? []), ...resourceRoles])];
    const fallbackName = [payload.given_name, payload.family_name].filter(Boolean).join(' ');

    return {
      sub: payload.sub ?? '',
      username: payload.preferred_username ?? payload.email ?? '',
      email: payload.email ?? '',
      name: payload.name ?? fallbackName ?? payload.preferred_username ?? payload.email ?? '',
      roles
    };
  }
}
