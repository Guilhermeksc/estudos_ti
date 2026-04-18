import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { SessionService } from '../services/session.service';

const ignoredPaths = ['/api/auth/login/', '/api/auth/token/refresh/'];

function shouldIgnoreRequest(url: string): boolean {
  return ignoredPaths.some((path) => url.includes(path));
}

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (shouldIgnoreRequest(request.url)) {
    return next(request);
  }

  const sessionService = inject(SessionService);
  const accessToken = sessionService.getAccessToken();

  if (!accessToken) {
    return next(request);
  }

  const authenticatedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return next(authenticatedRequest);
};
