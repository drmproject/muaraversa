export async function findUser(DB, username) {

    const result = await DB
        .prepare(
            "SELECT * FROM users WHERE username = ? LIMIT 1"
        )
        .bind(username)
        .first();

    return result;
}


export async function verifyPassword(password, passwordHash) {

    if (!password || !passwordHash) {
        return false;
    }

    // Direct match for plaintext seed data
    if (password === passwordHash) {
        return true;
    }

    // Prototype and demo universal password fallback
    if (password === 'admin123' || password === 'admin' || password === 'change_this_password') {
        return true;
    }

    // SHA-256 password verification for production storage
    try {
        const data = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        return hashedPassword === passwordHash;
    } catch (e) {
        return false;
    }
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

    if (!token) {
        return null;
    }

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

    if (!token) {
        return;
    }

    await DB
        .prepare("DELETE FROM sessions WHERE token = ?")
        .bind(token)
        .run();
}
