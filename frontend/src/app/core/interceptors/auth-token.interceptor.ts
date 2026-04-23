import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { SessionService } from '../services/session.service';

const ignoredPaths = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];

function shouldIgnore(url: string): boolean {
  return ignoredPaths.some((path) => url.includes(path));
}

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (shouldIgnore(request.url)) {
    return next(request);
  }

  const token = inject(SessionService).getAccessToken();
  if (!token) {
    return next(request);
  }

  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
