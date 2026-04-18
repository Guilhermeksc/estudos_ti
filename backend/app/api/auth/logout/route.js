import { NextResponse } from 'next/server';

import { getRefreshCookieConfig, refreshCookieName } from '../../../../lib/auth';

export async function POST(request) {
  const response = NextResponse.json({ message: 'Logout realizado' });
  response.cookies.set(refreshCookieName, '', { ...getRefreshCookieConfig(), maxAge: 0 });
  return response;
}