// Muaraversa Session Service

export async function createSession(db, userId) {
  const token = crypto.randomUUID();
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await db.prepare(`
    INSERT INTO sessions (user_id, token, expired_at)
    VALUES (?, ?, ?)
  `).bind(userId, token, expiredAt).run();

  return {
    token,
    expiredAt
  };
}

export async function validateSession(db, token) {
  const session = await db.prepare(`
    SELECT * FROM sessions
    WHERE token = ?
  `).bind(token).first();

  return session;
}

export async function removeSession(db, token) {
  await db.prepare(`
    DELETE FROM sessions WHERE token = ?
  `).bind(token).run();
}
