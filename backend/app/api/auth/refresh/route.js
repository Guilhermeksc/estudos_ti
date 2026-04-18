import { NextResponse } from 'next/server';

import {
  decodeJwtPayload,
  getRefreshCookieConfig,
  refreshCookieName,
  refreshCookieMaxAgeSeconds
} from '../../../../lib/auth';
import { buildCorsHeaders, withCors } from '../../../../lib/cors';
import { djangoRefresh } from '../../../../lib/django-auth';

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
      return withCors(NextResponse.json({ message: 'Refresh token ausente' }, { status: 401 }), request);
    }

    const djangoResponse = await djangoRefresh(refreshToken);
    const data = await djangoResponse.json().catch(() => ({}));

    if (!djangoResponse.ok || !data?.access) {
      const unauthorized = NextResponse.json(
        { message: data?.detail || 'Não foi possível renovar a sessão' },
        { status: 401 }
      );
      unauthorized.cookies.set(refreshCookieName, '', {
        ...getRefreshCookieConfig(),
        maxAge: 0
      });
      return withCors(unauthorized, request);
    }

    const rotatedRefresh = data.refresh || refreshToken;
    const decoded = decodeJwtPayload(data.access);
    const response = NextResponse.json({
      accessToken: data.access,
      user: decoded
        ? {
            id: decoded.user_id || null,
            username: decoded.username || null,
            perfil: decoded.perfil || null,
            is_staff: decoded.is_staff || false
          }
        : null
    });

    response.cookies.set(refreshCookieName, rotatedRefresh, {
      ...getRefreshCookieConfig(),
      maxAge: refreshCookieMaxAgeSeconds
    });
    return withCors(response, request);
  } catch (error) {
    return withCors(
      NextResponse.json({ message: 'Falha ao renovar sessão no servidor externo' }, { status: 502 }),
      request
    );
  }
}