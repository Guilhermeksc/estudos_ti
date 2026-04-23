import { NextResponse } from 'next/server';

import { buildCorsHeaders, withCors } from '../../../../lib/cors';
import { getDb } from '../../../../lib/mongodb';
import { assertCanManageTi } from '../../../../lib/ti-materias-auth';
import { insertMateria, listAll, slugExists } from '../../../../lib/ti-materias-db';
import { validateMateriaPayload } from '../../../../lib/ti-materias-validate';

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin'))
  });
}

export async function GET(request) {
  try {
    const db = await getDb();
    const list = await listAll(db);
    return withCors(NextResponse.json(list), request);
  } catch (err) {
    console.error('[ti/materias GET]', err);
    const message = err instanceof Error ? err.message : 'Erro ao listar matérias';
    const status = message.includes('MONGODB_URI') ? 503 : 500;
    return withCors(NextResponse.json({ message }, { status }), request);
  }
}

export async function POST(request) {
  const auth = assertCanManageTi(request);
  if (!auth.ok) {
    return withCors(NextResponse.json({ message: auth.message }, { status: auth.status }), request);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return withCors(NextResponse.json({ message: 'JSON inválido' }, { status: 400 }), request);
  }

  const { error } = validateMateriaPayload(body, false);
  if (error) {
    return withCors(NextResponse.json({ message: error }, { status: 400 }), request);
  }

  try {
    const db = await getDb();
    if (await slugExists(db, body.slug.trim(), null)) {
      return withCors(
        NextResponse.json({ message: 'Já existe matéria com este slug' }, { status: 409 }),
        request
      );
    }

    const created = await insertMateria(db, {
      slug: body.slug.trim(),
      titulo: body.titulo.trim(),
      descricao: body.descricao.trim(),
      areaSlug: body.areaSlug.trim(),
      ativo: body.ativo,
      ordem: body.ordem,
      subareas: body.subareas,
      ferramentas: body.ferramentas
    });

    return withCors(NextResponse.json(created, { status: 201 }), request);
  } catch (err) {
    console.error('[ti/materias POST]', err);
    const message = err instanceof Error ? err.message : 'Erro ao criar matéria';
    const status = message.includes('MONGODB_URI') ? 503 : 500;
    return withCors(NextResponse.json({ message }, { status }), request);
  }
}
