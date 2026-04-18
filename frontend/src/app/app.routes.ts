import { Routes } from '@angular/router';

import { LoginPageComponent } from './features/auth/pages/login-page.component';
import { AreaDetailPageComponent } from './features/knowledge/pages/area-detail-page.component';
import { AreasPageComponent } from './features/knowledge/pages/areas-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'areas'
  },
  {
    path: 'areas',
    component: AreasPageComponent
  },
  {
    path: 'areas/:slug',
    component: AreaDetailPageComponent
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
