import { NextResponse } from 'next/server';

import { decodeJwtPayload, getRefreshCookieConfig, refreshCookieName } from '../../../../lib/auth';
import { buildCorsHeaders, withCors } from '../../../../lib/cors';
import { buildUserFromPayload, keycloakRefresh } from '../../../../lib/keycloak-auth';

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin'))
  });
}

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get(refreshCookieName)?.value;

    if (!refreshToken) {
      return withCors(NextResponse.json({ message: 'Sessão expirada' }, { status: 401 }), request);
    }

    const keycloakResponse = await keycloakRefresh(refreshToken);
    const data = await keycloakResponse.json().catch(() => ({}));

    if (!keycloakResponse.ok || !data?.access_token) {
      const expired = NextResponse.json(
        { message: data?.error_description || 'Não foi possível renovar a sessão' },
        { status: 401 }
      );
      expired.cookies.set(refreshCookieName, '', { ...getRefreshCookieConfig(), maxAge: 0 });
      return withCors(expired, request);
    }

    const rotatedRefresh = data.refresh_token || refreshToken;
    const payload = decodeJwtPayload(data.access_token);

    const response = NextResponse.json({
      accessToken: data.access_token,
      expiresIn: data.expires_in ?? 300,
      user: buildUserFromPayload(payload)
    });

    response.cookies.set(refreshCookieName, rotatedRefresh, getRefreshCookieConfig());
    return withCors(response, request);
  } catch {
    return withCors(
      NextResponse.json({ message: 'Falha ao renovar sessão' }, { status: 502 }),
      request
    );
  }
}
