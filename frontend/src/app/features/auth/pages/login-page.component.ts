import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CemosAuthService, CemosLoginResponse } from '../../../core/services/cemos-auth.service';
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

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  protected loading = false;
  protected testing = false;
  protected successMessage = '';
  protected errorMessage = '';
  protected integrationMessage = '';
  protected loginResponse: CemosLoginResponse | null = null;
  protected readonly isAuthenticated = this.sessionService.isAuthenticated;
  protected readonly currentUser = this.sessionService.user;

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
        this.loginResponse = response;
        this.successMessage = `Login realizado com sucesso no cemos2028.com para o usuário ${response.user?.username ?? username}.`;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.sessionService.clearSession();
        this.loginResponse = null;
        this.errorMessage = this.extractErrorMessage(error);
        this.loading = false;
      }
    });
  }

  protected onTestIntegration(): void {
    if (this.form.invalid || this.testing) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.testing = true;
    this.integrationMessage = '';

    this.authService.login(username.trim(), password).subscribe({
      next: (response) => {
        this.integrationMessage = `Integração OK: endpoint https://cemos2028.com/api/auth/login/ respondeu com access token para ${response.user?.username ?? username}.`;
        this.testing = false;
      },
      error: (error: HttpErrorResponse) => {
        this.integrationMessage = `Falha na integração: ${this.extractErrorMessage(error)}`;
        this.testing = false;
      }
    });
  }

  protected clearSession(): void {
    this.sessionService.clearSession();
    this.successMessage = 'Sessão local em memória removida.';
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    const detail = error?.error?.detail;
    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }

    return 'Não foi possível autenticar no cemos2028.com. Verifique usuário e senha.';
  }
}
