const keycloakUrl = (process.env.KEYCLOAK_URL ?? 'http://localhost:8180').replace(/\/$/, '');
const realm = process.env.KEYCLOAK_REALM ?? 'login-integrado';
const clientId = process.env.KEYCLOAK_CLIENT_ID ?? 'cemos-auth-gateway';
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET ?? '';

const tokenEndpoint = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`;
const logoutEndpoint = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout`;

function form(params) {
  return new URLSearchParams({ client_id: clientId, client_secret: clientSecret, ...params }).toString();
}

export async function keycloakLogin({ username, password }) {
  return fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form({ grant_type: 'password', username, password, scope: 'openid' }),
    cache: 'no-store'
  });
}

export async function keycloakRefresh(refreshToken) {
  return fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    cache: 'no-store'
  });
}

export async function keycloakLogout(refreshToken) {
  return fetch(logoutEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form({ refresh_token: refreshToken }),
    cache: 'no-store'
  });
}

/** Monta o objeto de usuário a partir do payload do access_token do Keycloak. */
export function buildUserFromPayload(payload) {
  if (!payload) return null;
  return {
    sub:      payload.sub                    ?? null,
    username: payload.preferred_username     ?? null,
    email:    payload.email                  ?? null,
    name:     payload.name                   ?? null,
    roles:    Array.isArray(payload.roles) ? payload.roles : []
  };
}
