import { Injectable, computed, signal } from '@angular/core';

import { CemosLoginResponse, CemosUser } from './cemos-auth.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly accessTokenState = signal<string | null>(null);
  private readonly refreshTokenState = signal<string | null>(null);
  private readonly userState = signal<CemosUser | null>(null);

  readonly accessToken = this.accessTokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.accessTokenState());

  setSession(payload: CemosLoginResponse): void {
    this.accessTokenState.set(payload.accessToken);
    this.refreshTokenState.set(null);
    this.userState.set(payload.user ?? null);
  }

  clearSession(): void {
    this.accessTokenState.set(null);
    this.refreshTokenState.set(null);
    this.userState.set(null);
  }

  getAccessToken(): string | null {
    return this.accessTokenState();
  }
}
