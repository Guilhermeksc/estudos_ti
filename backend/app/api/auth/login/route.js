import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getRefreshCookieConfig, refreshCookieName } from '../../../../lib/auth';
import { djangoLogin } from '../../../../lib/django-auth';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Payload inválido', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const djangoResponse = await djangoLogin({
      username: parsed.data.username.trim(),
      password: parsed.data.password
    });

    const data = await djangoResponse.json().catch(() => ({}));

    if (!djangoResponse.ok) {
      return NextResponse.json(
        { message: data?.detail || 'Credenciais inválidas' },
        { status: djangoResponse.status }
      );
    }

    if (!data?.access || !data?.refresh) {
      return NextResponse.json(
        { message: 'Resposta inválida do serviço de autenticação' },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      accessToken: data.access,
      user: data.user || null
    });

    response.cookies.set(refreshCookieName, data.refresh, getRefreshCookieConfig());
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Falha ao autenticar no servidor externo' }, { status: 502 });
  }
}