const authBaseUrl = (process.env.DJANGO_AUTH_BASE_URL || 'https://cemos2028.com').replace(/\/$/, '');

function buildUrl(path) {
  return `${authBaseUrl}${path}`;
}

export async function djangoLogin({ username, password }) {
  const response = await fetch(buildUrl('/api/auth/login/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
    cache: 'no-store'
  });

  return response;
}

export async function djangoRefresh(refresh) {
  const response = await fetch(buildUrl('/api/auth/token/refresh/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ refresh }),
    cache: 'no-store'
  });

  return response;
}
