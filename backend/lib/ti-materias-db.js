const COLLECTION = 'ti_materias';
const SEQ = 'ti_sequences';

/**
 * @param {import('mongodb').Db} db
 */
async function nextNumericId(db) {
  const coll = db.collection(SEQ);
  const updated = await coll.findOneAndUpdate(
    { _id: 'ti_materias' },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  if (updated && typeof updated.seq === 'number') {
    return updated.seq;
  }
  const doc = await coll.findOne({ _id: 'ti_materias' });
  if (doc && typeof doc.seq === 'number') {
    return doc.seq;
  }
  throw new Error('Não foi possível gerar id para ti_materias');
}

function sortMaterias(a, b) {
  const oa = a.ordem ?? 0;
  const ob = b.ordem ?? 0;
  if (oa !== ob) return oa - ob;
  return String(a.titulo ?? '').localeCompare(String(b.titulo ?? ''), 'pt');
}

function toIso(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  return null;
}

export function toCardDto(doc) {
  const subareas = doc.subareas ?? [];
  const ferramentas = doc.ferramentas ?? [];
  return {
    id: doc.id,
    slug: doc.slug,
    titulo: doc.titulo,
    descricao: doc.descricao,
    areaSlug: doc.areaSlug,
    subareasCount: subareas.length,
    ferramentasCount: ferramentas.length
  };
}

export function toMateriaDto(doc) {
  const subareas = doc.subareas ?? [];
  const ferramentas = doc.ferramentas ?? [];
  return {
    id: doc.id,
    slug: doc.slug,
    titulo: doc.titulo,
    descricao: doc.descricao,
    areaSlug: doc.areaSlug,
    ativo: doc.ativo !== false,
    ordem: doc.ordem ?? 0,
    subareas: subareas.map((s, i) => ({
      id: s.id ?? i + 1,
      slug: s.slug,
      titulo: s.titulo,
      descricao: s.descricao ?? null,
      ordem: s.ordem ?? 0
    })),
    ferramentas: ferramentas.map((f, i) => ({
      id: f.id ?? i + 1,
      slug: f.slug,
      titulo: f.titulo,
      descricao: f.descricao ?? null,
      ordem: f.ordem ?? 0
    })),
    createdAt: toIso(doc.createdAt),
    updatedAt: toIso(doc.updatedAt)
  };
}

/**
 * @param {import('mongodb').Db} db
 */
export async function listCards(db) {
  const coll = db.collection(COLLECTION);
  const docs = await coll.find({ ativo: { $ne: false } }).toArray();
  return docs.sort(sortMaterias).map(toCardDto);
}

/**
 * @param {import('mongodb').Db} db
 */
export async function listAll(db) {
  const coll = db.collection(COLLECTION);
  const docs = await coll.find({}).toArray();
  return docs.sort(sortMaterias).map(toMateriaDto);
}

/**
 * @param {import('mongodb').Db} db
 */
export async function findById(db, id) {
  const coll = db.collection(COLLECTION);
  const doc = await coll.findOne({ id: Number(id) });
  return doc ? toMateriaDto(doc) : null;
}

/**
 * @param {import('mongodb').Db} db
 */
export async function slugExists(db, slug, excludeId) {
  const coll = db.collection(COLLECTION);
  const filter = { slug };
  if (excludeId != null) {
    filter.id = { $ne: Number(excludeId) };
  }
  const found = await coll.findOne(filter);
  return Boolean(found);
}

/**
 * @param {import('mongodb').Db} db
 * @param {object} body
 */
export async function insertMateria(db, body) {
  const now = new Date();
  const id = await nextNumericId(db);
  const doc = {
    id,
    slug: body.slug,
    titulo: body.titulo,
    descricao: body.descricao,
    areaSlug: body.areaSlug,
    ativo: body.ativo !== false,
    ordem: body.ordem ?? 0,
    subareas: Array.isArray(body.subareas) ? body.subareas : [],
    ferramentas: Array.isArray(body.ferramentas) ? body.ferramentas : [],
    createdAt: now,
    updatedAt: now
  };
  await db.collection(COLLECTION).insertOne(doc);
  return toMateriaDto(doc);
}

/**
 * @param {import('mongodb').Db} db
 */
export async function updateMateria(db, id, body) {
  const coll = db.collection(COLLECTION);
  const numId = Number(id);
  const existing = await coll.findOne({ id: numId });
  if (!existing) return null;

  const now = new Date();
  const subareas = body.subareas !== undefined ? body.subareas : existing.subareas ?? [];
  const ferramentas =
    body.ferramentas !== undefined ? body.ferramentas : existing.ferramentas ?? [];

  const next = {
    ...existing,
    slug: body.slug ?? existing.slug,
    titulo: body.titulo ?? existing.titulo,
    descricao: body.descricao ?? existing.descricao,
    areaSlug: body.areaSlug ?? existing.areaSlug,
    ativo: body.ativo !== undefined ? body.ativo !== false : existing.ativo !== false,
    ordem: body.ordem !== undefined ? body.ordem : existing.ordem ?? 0,
    subareas,
    ferramentas,
    updatedAt: now
  };

  await coll.replaceOne({ id: numId }, next);
  return toMateriaDto(next);
}

/**
 * @param {import('mongodb').Db} db
 */
export async function deleteMateria(db, id) {
  const coll = db.collection(COLLECTION);
  const res = await coll.deleteOne({ id: Number(id) });
  return res.deletedCount === 1;
}
