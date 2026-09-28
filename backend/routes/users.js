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

    if (request.method === "GET") {
        const result = await env.DB
            .prepare("SELECT id, username, name, role, status FROM users")
            .all();

        return jsonResponse({
            success: true,
            users: result.results || []
        });
    }

    return jsonResponse({
        success: false,
        message: "Method not implemented"
    }, 405);
}
