import { NextResponse } from 'next/server';

import {
  decodeJwtPayload,
  getRefreshCookieConfig,
  refreshCookieName,
  refreshCookieMaxAgeSeconds
} from '../../../../lib/auth';
import { djangoRefresh } from '../../../../lib/django-auth';

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get(refreshCookieName)?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token ausente' }, { status: 401 });
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
      return unauthorized;
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
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Falha ao renovar sessão no servidor externo' }, { status: 502 });
  }
}