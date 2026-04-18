import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json(
    {
      message: 'Cadastro não é realizado neste serviço. Use o backend Django em produção.',
      registerUrl: `${(process.env.DJANGO_AUTH_BASE_URL || 'https://cemos2028.com').replace(/\/$/, '')}/register/`
    },
    { status: 501 }
  );
}