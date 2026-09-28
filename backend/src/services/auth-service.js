export async function login(env, username, password) {
  if (!env || !env.DB) {
    throw new Error('Database binding not configured');
  }

  const user = await env.DB
    .prepare('SELECT id, username, password_hash, role_id FROM users WHERE username = ?')
    .bind(username)
    .first();

  if (!user) {
    return null;
  }

  // Password verification will be connected to hashing library in next step.
  return {
    id: user.id,
    username: user.username,
    role_id: user.role_id
  };
}
