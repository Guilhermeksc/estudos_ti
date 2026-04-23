import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CemosAuthService } from '../../../core/services/cemos-auth.service';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(CemosAuthService);
  private readonly sessionService = inject(SessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  protected loading = false;
  protected successMessage = '';
  protected errorMessage = '';

  protected readonly isAuthenticated = this.sessionService.isAuthenticated;
  protected readonly currentUser = this.sessionService.user;

  protected onGoogleLogin(): void {
    this.authService.loginWithProvider('google', this.getReturnUrl());
  }

  protected onSubmitLogin(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.login(username.trim(), password).subscribe({
      next: (response) => {
        this.sessionService.setSession(response);
        this.successMessage = `Login realizado com sucesso. Bem-vindo, ${response.user?.name ?? response.user?.username ?? username}!`;
        this.loading = false;
        void this.router.navigateByUrl(this.getInternalReturnUrl(), { replaceUrl: true });
      },
      error: (error: HttpErrorResponse) => {
        this.sessionService.clearSession();
        this.errorMessage = this.extractErrorMessage(error);
        this.loading = false;
      }
    });
  }

  protected onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.sessionService.clearSession();
        this.successMessage = 'Sessão encerrada.';
      },
      error: () => {
        // Limpa a sessão local mesmo se o logout remoto falhar
        this.sessionService.clearSession();
        this.successMessage = 'Sessão encerrada localmente.';
      }
    });
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    const message = error?.error?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
    return 'Não foi possível autenticar. Verifique usuário e senha.';
  }

  private getReturnUrl(): string {
    const returnUrl = this.getInternalReturnUrl();
    return `${window.location.origin}${returnUrl}`;
  }

  private getInternalReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }
    return '/areas';
  }
}
