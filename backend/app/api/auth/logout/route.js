import { NextResponse } from 'next/server';

import { getRefreshCookieConfig, refreshCookieName } from '../../../../lib/auth';
import { buildCorsHeaders, withCors } from '../../../../lib/cors';

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin'))
  });
}

export async function POST(request) {
  const response = NextResponse.json({ message: 'Logout realizado' });
  response.cookies.set(refreshCookieName, '', { ...getRefreshCookieConfig(), maxAge: 0 });
  return withCors(response, request);
}