export async function requireAuth(request, env) {
  const auth = request.headers.get('Authorization');

  if (!auth) {
    return { error: 'Unauthorized' };
  }

  return {
    authenticated: true
  };
}
