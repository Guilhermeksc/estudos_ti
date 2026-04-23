import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { AuthCallbackComponent } from './features/auth/pages/auth-callback.component';
import { LoginPageComponent } from './features/auth/pages/login-page.component';
import { AreaDetailPageComponent } from './features/knowledge/pages/area-detail-page.component';
import { AreasPageComponent } from './features/knowledge/pages/areas-page.component';
import { MaterialPageComponent } from './features/knowledge/pages/material-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginPageComponent
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent
  },
  {
    path: 'areas',
    canActivate: [authGuard],
    component: AreasPageComponent
  },
  {
    path: 'areas/:slug',
    canActivate: [authGuard],
    component: AreaDetailPageComponent
  },
  {
    path: 'areas/:slug/material/:materialIndex',
    canActivate: [authGuard],
    component: MaterialPageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '**',
    redirectTo: 'areas'
  }
];
