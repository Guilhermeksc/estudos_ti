export const refreshCookieName = 'refresh_token';
export const refreshCookieMaxAgeSeconds = 60 * 60 * 24 * 7;

export function getBearerToken(request) {
  const header = request.headers.get('authorization');
  if (!header || !header.toLowerCase().startsWith('bearer ')) {
    return null;
  }

  return header.slice(7).trim();
}

export function getRefreshCookieConfig() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: refreshCookieMaxAgeSeconds
  };
}

export function decodeJwtPayload(token) {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payloadBuffer = Buffer.from(parts[1], 'base64url');
    return JSON.parse(payloadBuffer.toString('utf-8'));
  } catch {
    return null;
  }
}