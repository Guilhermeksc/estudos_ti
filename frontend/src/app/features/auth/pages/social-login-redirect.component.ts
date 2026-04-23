import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { CemosAuthService } from '../../../core/services/cemos-auth.service';

@Component({
  selector: 'app-social-login-redirect',
  imports: [CommonModule],
  template: `
    <section class="redirect-page">
      <h1>Redirecionando para login...</h1>
      <p>Você será enviado para a autenticação Google.</p>
    </section>
  `,
  styles: [
    `
      .redirect-page {
        min-height: 50vh;
        display: grid;
        place-content: center;
        gap: 0.5rem;
        text-align: center;
      }

      h1,
      p {
        margin: 0;
      }

      p {
        color: #4b5563;
      }
    `
  ]
})
export class SocialLoginRedirectComponent implements OnInit {
  private readonly authService = inject(CemosAuthService);

  ngOnInit(): void {
    this.authService.loginWithProvider('google', `${window.location.origin}/areas`);
  }
}
