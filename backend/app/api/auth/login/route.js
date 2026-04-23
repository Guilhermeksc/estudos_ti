import { NextResponse } from 'next/server';
import { z } from 'zod';

import { decodeJwtPayload, getRefreshCookieConfig, refreshCookieName } from '../../../../lib/auth';
import { buildCorsHeaders, withCors } from '../../../../lib/cors';
import { buildUserFromPayload, keycloakLogin } from '../../../../lib/keycloak-auth';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin'))
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return withCors(
        NextResponse.json({ message: 'Payload inválido', errors: parsed.error.flatten() }, { status: 400 }),
        request
      );
    }

    const keycloakResponse = await keycloakLogin({
      username: parsed.data.username.trim(),
      password: parsed.data.password
    });

    const data = await keycloakResponse.json().catch(() => ({}));

    if (!keycloakResponse.ok) {
      const status = keycloakResponse.status === 401 ? 401 : 502;
      const message = data?.error_description || data?.error || 'Credenciais inválidas';
      return withCors(NextResponse.json({ message }, { status }), request);
    }

    if (!data?.access_token || !data?.refresh_token) {
      return withCors(
        NextResponse.json({ message: 'Resposta inválida do servidor de autenticação' }, { status: 502 }),
        request
      );
    }

    const payload = decodeJwtPayload(data.access_token);
    const response = NextResponse.json({
      accessToken: data.access_token,
      expiresIn: data.expires_in ?? 300,
      user: buildUserFromPayload(payload)
    });

    response.cookies.set(refreshCookieName, data.refresh_token, getRefreshCookieConfig());
    return withCors(response, request);
  } catch {
    return withCors(
      NextResponse.json({ message: 'Falha ao autenticar no servidor' }, { status: 502 }),
      request
    );
  }
}
