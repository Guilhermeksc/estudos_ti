import { NextResponse } from 'next/server';

import { decodeJwtPayload, getBearerToken } from '../../../../lib/auth';

export async function GET(request) {
  const token = getBearerToken(request);

  if (!token) {
    return NextResponse.json({ message: 'Token ausente' }, { status: 401 });
  }

  const payload = decodeJwtPayload(token);

  if (!payload) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: payload.user_id || null,
      username: payload.username || null,
      perfil: payload.perfil || null,
      is_staff: payload.is_staff || false
    },
    exp: payload.exp || null,
    iat: payload.iat || null
  });
}