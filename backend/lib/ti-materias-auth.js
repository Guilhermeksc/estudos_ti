import { decodeJwtPayload, getBearerToken } from './auth';

function collectRoles(payload) {
  if (!payload) return [];
  if (Array.isArray(payload.roles) && payload.roles.length > 0) {
    return payload.roles;
  }
  const realm = payload.realm_access?.roles;
  if (Array.isArray(realm)) return realm;
  return [];
}

export function canManageTiMaterias(payload) {
  const roles = new Set(collectRoles(payload));
  return (
    roles.has('ADMIN') ||
    roles.has('EDITOR') ||
    roles.has('ROLE_ADMIN') ||
    roles.has('ROLE_EDITOR')
  );
}

export function getTiAuthPayload(request) {
  const token = getBearerToken(request);
  if (!token) return null;
  return decodeJwtPayload(token);
}

export function assertCanManageTi(request) {
  const payload = getTiAuthPayload(request);
  if (!payload) {
    return { ok: false, status: 401, message: 'Token ausente ou inválido' };
  }
  if (!canManageTiMaterias(payload)) {
    return { ok: false, status: 403, message: 'Permissão insuficiente' };
  }
  return { ok: true, payload };
}
