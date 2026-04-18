import { NextResponse } from 'next/server';

import { buildCorsHeaders, withCors } from '../../../../lib/cors';
import { decodeJwtPayload, getBearerToken } from '../../../../lib/auth';

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin'))
  });
}

export async function GET(request) {
  const token = getBearerToken(request);

  if (!token) {
    return withCors(NextResponse.json({ message: 'Token ausente' }, { status: 401 }), request);
  }

  const payload = decodeJwtPayload(token);

  if (!payload) {
    return withCors(NextResponse.json({ message: 'Token inválido' }, { status: 401 }), request);
  }

  return withCors(
    NextResponse.json({
      user: {
        id: payload.user_id || null,
        username: payload.username || null,
        perfil: payload.perfil || null,
        is_staff: payload.is_staff || false
      },
      exp: payload.exp || null,
      iat: payload.iat || null
    }),
    request
  );
}