import { Injectable, computed, signal } from '@angular/core';

import { AuthUser, LoginResponse } from './cemos-auth.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly accessTokenState = signal<string | null>(null);
  private readonly userState = signal<AuthUser | null>(null);

  readonly accessToken = this.accessTokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.accessTokenState());

  setSession(payload: LoginResponse): void {
    this.accessTokenState.set(payload.accessToken);
    this.userState.set(payload.user ?? null);
  }

  clearSession(): void {
    this.accessTokenState.set(null);
    this.userState.set(null);
  }

  getAccessToken(): string | null {
    return this.accessTokenState();
  }

  hasRole(role: string): boolean {
    return this.userState()?.roles.includes(role) ?? false;
  }
}
