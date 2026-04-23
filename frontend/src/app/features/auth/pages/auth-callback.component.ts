import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CemosAuthService, OAuthTokenFragment } from '../../../core/services/cemos-auth.service';
import { SessionService } from '../../../core/services/session.service';

interface OAuthFragment {
  access_token?: string;
  refresh_token?: string;
  expires_in?: string;
  refresh_expires_in?: string;
  token_type?: string;
  return_url?: string;
  error?: string;
}

@Component({
  selector: 'app-auth-callback',
  imports: [CommonModule],
  template: `
    <section class="callback-page">
      <h1>{{ message }}</h1>
    </section>
  `,
  styles: [
    `
      .callback-page {
        min-height: 50vh;
        display: grid;
        place-content: center;
        text-align: center;
      }

      h1 {
        margin: 0;
        font-size: 1.25rem;
      }
    `
  ]
})
export class AuthCallbackComponent implements OnInit {
  private readonly authService = inject(CemosAuthService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  protected message = 'Concluindo autenticação...';

  ngOnInit(): void {
    const fragment = this.parseFragment(window.location.hash);

    if (fragment.error) {
      this.fail(fragment.error);
      return;
    }

    if (!fragment.access_token) {
      this.fail('missing_access_token');
      return;
    }

    const tokens: OAuthTokenFragment = {
      access_token: fragment.access_token,
      refresh_token: fragment.refresh_token,
      expires_in: this.toNumber(fragment.expires_in),
      refresh_expires_in: this.toNumber(fragment.refresh_expires_in),
      token_type: fragment.token_type ?? 'Bearer'
    };

    this.sessionService.setSession(this.authService.buildLoginResponseFromOAuth(tokens));
    this.eraseFragmentFromHistory();

    void this.router.navigateByUrl(this.resolveTarget(fragment.return_url), { replaceUrl: true });
  }

  private parseFragment(hash: string): OAuthFragment {
    const fragment: OAuthFragment = {};
    if (!hash || hash.length <= 1) {
      return fragment;
    }

    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    params.forEach((value, key) => {
      (fragment as Record<string, string>)[key] = value;
    });
    return fragment;
  }

  private toNumber(value: string | undefined): number | undefined {
    if (!value) {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private resolveTarget(returnUrl: string | undefined): string {
    if (!returnUrl) {
      return '/areas';
    }
    if (returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }

    try {
      const url = new URL(returnUrl, window.location.origin);
      if (url.origin === window.location.origin) {
        return url.pathname + url.search + url.hash;
      }
    } catch {
      return '/areas';
    }

    return '/areas';
  }

  private eraseFragmentFromHistory(): void {
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname + window.location.search
    );
  }

  private fail(reason: string): void {
    this.message = 'Não foi possível concluir o login.';
    void this.router.navigate(['/login'], {
      queryParams: { oauth_error: reason },
      replaceUrl: true
    });
  }
}
