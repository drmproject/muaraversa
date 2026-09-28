import {
    requireAuth,
    requireRole
} from "../middleware/auth.js";

import {
    jsonResponse
} from "../services/response.js";

export async function users(request, env) {

    await requireAuth(request, env.DB);

    await requireRole(request, env.DB, ["admin"]);

    const method = request.method;

    if (method === "GET") {
        const result = await env.DB
            .prepare("SELECT id, username, name, role, status FROM users")
            .all();

        return jsonResponse({
            success: true,
            users: result.results || []
        });
    }

    if (method === "POST") {
        const body = await request.json();

        await env.DB
            .prepare(`
                INSERT INTO users
                (username, password_hash, name, role, status)
                VALUES (?, ?, ?, ?, ?)
            `)
            .bind(
                body.username,
                body.password_hash || body.password,
                body.name,
                body.role,
                "active"
            )
            .run();

        return jsonResponse({
            success: true,
            message: "User created"
        });
    }

    if (method === "PUT") {
        const id = new URL(request.url).searchParams.get("id");
        const body = await request.json();

        await env.DB
            .prepare(`
                UPDATE users
                SET name=?, role=?, status=?
                WHERE id=?
            `)
            .bind(
                body.name,
                body.role,
                body.status,
                id
            )
            .run();

        return jsonResponse({
            success: true,
            message: "User updated"
        });
    }

    if (method === "DELETE") {
        const id = new URL(request.url).searchParams.get("id");

        await env.DB
            .prepare(`
                UPDATE users
                SET status='inactive'
                WHERE id=?
            `)
            .bind(id)
            .run();

        return jsonResponse({
            success: true,
            message: "User deactivated"
        });
    }

    return jsonResponse({
        success:false,
        message:"Method not implemented"
    },405);
}
