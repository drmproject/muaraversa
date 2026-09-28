import {
    findUser,
    verifyPassword,
    createSession,
    getSessionUser,
    removeSession
} from "../services/auth.js";

import {
    jsonResponse
} from "../services/response.js";


export async function login(request, DB) {

    const body = await request.json();

    const user = await findUser(DB, body.username);

    if (!user) {
        return jsonResponse({
            success: false,
            message: "Username atau password salah"
        }, 401);
    }

    const valid = await verifyPassword(
        body.password,
        user.password_hash || user.password
    );

    if (!valid) {
        return jsonResponse({
            success: false,
            message: "Username atau password salah"
        }, 401);
    }

    const token = await createSession(DB, user.id);

    return jsonResponse({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            role: user.role
        }
    });
}


export async function me(request, DB) {

    const token = request.headers
        .get("Authorization")
        ?.replace("Bearer ", "");

    const user = await getSessionUser(DB, token);

    return jsonResponse({
        authenticated: !!user,
        user: user || null
    });
}


export async function logout(request, DB) {

    const token = request.headers
        .get("Authorization")
        ?.replace("Bearer ", "");

    await removeSession(DB, token);

    return jsonResponse({
        success: true
    });
}
