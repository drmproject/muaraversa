import {
    getSessionUser
} from "../services/auth.js";

export async function getAuthUser(request, DB) {
    const header = request.headers.get("Authorization") || "";
    const token = header.replace("Bearer ", "");

    return await getSessionUser(DB, token);
}

export async function requireAuth(request, DB) {
    const user = await getAuthUser(request, DB);

    if (!user) {
        throw new Error("Unauthorized");
    }

    return user;
}

export async function requireRole(request, DB, roles = []) {
    const user = await getAuthUser(request, DB);

    if (!user) {
        throw new Error("Unauthorized");
    }

    if (!roles.includes(user.role)) {
        throw new Error("Forbidden");
    }

    return user;
}
