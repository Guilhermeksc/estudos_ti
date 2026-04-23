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
      { message: 'Cadastro de usuários é gerenciado pelo painel do Keycloak ou pelo fluxo de registro da plataforma principal.' },
      { status: 501 }
    ),
    request
  );
}
