export function validateMateriaPayload(body, partial = false) {
  if (!body || typeof body !== 'object') {
    return { error: 'JSON inválido' };
  }

  const checks = [
    ['slug', partial ? null : 'slug é obrigatório'],
    ['titulo', partial ? null : 'titulo é obrigatório'],
    ['descricao', partial ? null : 'descricao é obrigatório'],
    ['areaSlug', partial ? null : 'areaSlug é obrigatório']
  ];

  for (const [key, requiredMsg] of checks) {
    if (body[key] === undefined) {
      if (requiredMsg) return { error: requiredMsg };
      continue;
    }
    if (typeof body[key] !== 'string' || !body[key].trim()) {
      return { error: `${key} inválido` };
    }
  }

  if (body.ordem !== undefined && body.ordem !== null && typeof body.ordem !== 'number') {
    return { error: 'ordem deve ser número' };
  }

  if (body.ativo !== undefined && typeof body.ativo !== 'boolean') {
    return { error: 'ativo deve ser boolean' };
  }

  return { error: null };
}
