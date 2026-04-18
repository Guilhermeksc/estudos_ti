const allowedOrigins = (process.env.CORS_ORIGIN || 'https://gkdevstudio.com,https://www.gkdevstudio.com,http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function resolveOrigin(requestOrigin) {
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] || '*';
}

export function buildCorsHeaders(requestOrigin) {
  return {
    'Access-Control-Allow-Origin': resolveOrigin(requestOrigin),
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin'
  };
}

export function withCors(response, request) {
  const origin = request.headers.get('origin');
  const headers = buildCorsHeaders(origin);

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
