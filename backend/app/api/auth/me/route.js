import { NextResponse } from 'next/server';

import { decodeJwtPayload, getBearerToken } from '../../../../lib/auth';
import { buildCorsHeaders, withCors } from '../../../../lib/cors';
import { buildUserFromPayload } from '../../../../lib/keycloak-auth';

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
      user: buildUserFromPayload(payload),
      exp: payload.exp ?? null,
      iat: payload.iat ?? null
    }),
    request
  );
}
