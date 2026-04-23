import { NextResponse } from 'next/server';

import { buildCorsHeaders } from './lib/cors';

/**
 * Preflight e respostas sem handler (404) não passam por withCors nas route handlers.
 * Sem isto, o browser mostra "CORS Missing Allow Origin" mesmo quando o problema é 404.
 */
export function middleware(request) {
  const origin = request.headers.get('origin');
  const corsHeaders = buildCorsHeaders(origin);

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  matcher: '/api/:path*'
};
