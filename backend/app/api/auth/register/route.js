import { NextResponse } from 'next/server';

import { buildCorsHeaders, withCors } from '../../../../lib/cors';

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin'))
  });
}

export async function POST(request) {
  return withCors(
    NextResponse.json(
      {
        message: 'Cadastro não é realizado neste serviço. Use o backend Django em produção.',
        registerUrl: `${(process.env.DJANGO_AUTH_BASE_URL || 'https://cemos2028.com').replace(/\/$/, '')}/register/`
      },
      { status: 501 }
    ),
    request
  );
}