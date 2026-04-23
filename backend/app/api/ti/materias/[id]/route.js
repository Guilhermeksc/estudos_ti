import { NextResponse } from 'next/server';

import { buildCorsHeaders, withCors } from '../../../../../lib/cors';
import { getDb } from '../../../../../lib/mongodb';
import { assertCanManageTi } from '../../../../../lib/ti-materias-auth';
import { deleteMateria, findById, slugExists, updateMateria } from '../../../../../lib/ti-materias-db';
import { validateMateriaPayload } from '../../../../../lib/ti-materias-validate';

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request.headers.get('origin'))
  });
}

export async function GET(request, context) {
  const { id } = await context.params;
  try {
    const db = await getDb();
    const materia = await findById(db, id);
    if (!materia) {
      return withCors(NextResponse.json({ message: 'Não encontrado' }, { status: 404 }), request);
    }
    return withCors(NextResponse.json(materia), request);
  } catch (err) {
    console.error('[ti/materias/:id GET]', err);
    const message = err instanceof Error ? err.message : 'Erro ao buscar matéria';
    const status = message.includes('MONGODB_URI') ? 503 : 500;
    return withCors(NextResponse.json({ message }, { status }), request);
  }
}

export async function PUT(request, context) {
  const auth = assertCanManageTi(request);
  if (!auth.ok) {
    return withCors(NextResponse.json({ message: auth.message }, { status: auth.status }), request);
  }

  const { id } = await context.params;

  let body;
  try {
    body = await request.json();
  } catch {
    return withCors(NextResponse.json({ message: 'JSON inválido' }, { status: 400 }), request);
  }

  const { error } = validateMateriaPayload(body, true);
  if (error) {
    return withCors(NextResponse.json({ message: error }, { status: 400 }), request);
  }

  try {
    const db = await getDb();
    if (body.slug && (await slugExists(db, body.slug.trim(), id))) {
      return withCors(
        NextResponse.json({ message: 'Já existe matéria com este slug' }, { status: 409 }),
        request
      );
    }

    const patch = {
      ...(body.slug !== undefined ? { slug: body.slug.trim() } : {}),
      ...(body.titulo !== undefined ? { titulo: body.titulo.trim() } : {}),
      ...(body.descricao !== undefined ? { descricao: body.descricao.trim() } : {}),
      ...(body.areaSlug !== undefined ? { areaSlug: body.areaSlug.trim() } : {}),
      ...(body.ativo !== undefined ? { ativo: body.ativo } : {}),
      ...(body.ordem !== undefined ? { ordem: body.ordem } : {}),
      ...(body.subareas !== undefined ? { subareas: body.subareas } : {}),
      ...(body.ferramentas !== undefined ? { ferramentas: body.ferramentas } : {})
    };

    const updated = await updateMateria(db, id, patch);
    if (!updated) {
      return withCors(NextResponse.json({ message: 'Não encontrado' }, { status: 404 }), request);
    }
    return withCors(NextResponse.json(updated), request);
  } catch (err) {
    console.error('[ti/materias/:id PUT]', err);
    const message = err instanceof Error ? err.message : 'Erro ao atualizar matéria';
    const status = message.includes('MONGODB_URI') ? 503 : 500;
    return withCors(NextResponse.json({ message }, { status }), request);
  }
}

export async function DELETE(request, context) {
  const auth = assertCanManageTi(request);
  if (!auth.ok) {
    return withCors(NextResponse.json({ message: auth.message }, { status: auth.status }), request);
  }

  const { id } = await context.params;

  try {
    const db = await getDb();
    const ok = await deleteMateria(db, id);
    if (!ok) {
      return withCors(NextResponse.json({ message: 'Não encontrado' }, { status: 404 }), request);
    }
    return withCors(new NextResponse(null, { status: 204 }), request);
  } catch (err) {
    console.error('[ti/materias/:id DELETE]', err);
    const message = err instanceof Error ? err.message : 'Erro ao remover matéria';
    const status = message.includes('MONGODB_URI') ? 503 : 500;
    return withCors(NextResponse.json({ message }, { status }), request);
  }
}
