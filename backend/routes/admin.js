import { requireRole } from "../middleware/auth.js";
import { getSessionUser } from "../services/auth.js";
import { jsonResponse } from "../services/response.js";

export async function adminProfile(request, DB) {

    const token = request.headers
        .get("Authorization")
        ?.replace("Bearer ", "");

    const user = await getSessionUser(DB, token);

    const access = requireRole(user, ["admin"]);

    if (access) {
        return jsonResponse(access, 403);
    }

    return jsonResponse({
        success: true,
        message: "Admin access granted",
        user
    });
}
