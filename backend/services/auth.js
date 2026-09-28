export async function findUser(DB, username) {

    const result = await DB
        .prepare(
            "SELECT * FROM users WHERE username = ? LIMIT 1"
        )
        .bind(username)
        .first();

    return result;
}


export async function createSession(DB, userId) {

    const token = crypto.randomUUID();

    await DB
        .prepare(
            "INSERT INTO sessions (user_id, token, expired_at) VALUES (?, ?, datetime('now', '+1 day'))"
        )
        .bind(userId, token)
        .run();

    return token;
}


export async function getSessionUser(DB, token) {

    return await DB
        .prepare(
            `SELECT users.id, users.username, users.name, users.role
             FROM sessions
             JOIN users ON users.id = sessions.user_id
             WHERE sessions.token = ?
             AND sessions.expired_at > datetime('now')`
        )
        .bind(token)
        .first();
}


export async function removeSession(DB, token) {

    await DB
        .prepare("DELETE FROM sessions WHERE token = ?")
        .bind(token)
        .run();
}
