import { NextResponse } from 'next/server';

import { getRefreshCookieConfig, refreshCookieName } from '../../../../lib/auth';
import { buildCorsHeaders, withCors } from '../../../../lib/cors';
import { keycloakLogout } from '../../../../lib/keycloak-auth';

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin'))
  });
}

export async function POST(request) {
  const refreshToken = request.cookies.get(refreshCookieName)?.value;

  // Invalida a sessão no Keycloak se o cookie existir.
  // Falha silenciosa: mesmo que o Keycloak não responda, o cookie é removido.
  if (refreshToken) {
    await keycloakLogout(refreshToken).catch(() => null);
  }

  const response = NextResponse.json({ message: 'Logout realizado' });
  response.cookies.set(refreshCookieName, '', { ...getRefreshCookieConfig(), maxAge: 0 });
  return withCors(response, request);
}
