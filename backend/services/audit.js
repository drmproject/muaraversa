export async function writeAudit(DB, userId, action, detail = "") {
    if (!DB || !userId || !action) {
        return;
    }

    await DB
        .prepare(`
            INSERT INTO audit_logs
            (user_id, action, detail, created_at)
            VALUES (?, ?, ?, datetime('now'))
        `)
        .bind(
            userId,
            action,
            detail
        )
        .run();
}

export async function getAuditLogs(DB, limit = 100) {
    const result = await DB
        .prepare(`
            SELECT
                audit_logs.*,
                users.username,
                users.name
            FROM audit_logs
            LEFT JOIN users
            ON users.id = audit_logs.user_id
            ORDER BY audit_logs.created_at DESC
            LIMIT ?
        `)
        .bind(limit)
        .all();

    return result.results || [];
}
