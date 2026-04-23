import { NextResponse } from 'next/server';

import { buildCorsHeaders, withCors } from '../../../../../lib/cors';
import { getDb } from '../../../../../lib/mongodb';
import { listCards } from '../../../../../lib/ti-materias-db';

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin'))
  });
}

export async function GET(request) {
  try {
    const db = await getDb();
    const cards = await listCards(db);
    return withCors(NextResponse.json(cards), request);
  } catch (err) {
    console.error('[ti/materias/cards]', err);
    const message = err instanceof Error ? err.message : 'Erro ao listar cards';
    const status = message.includes('MONGODB_URI') ? 503 : 500;
    return withCors(NextResponse.json({ message }, { status }), request);
  }
}
