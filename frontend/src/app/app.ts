import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { CemosAuthService } from './core/services/cemos-auth.service';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authService = inject(CemosAuthService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.sessionService.isAuthenticated;
  protected readonly currentUser = this.sessionService.user;

  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout()
    });
  }

  private finishLogout(): void {
    this.sessionService.clearSession();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
