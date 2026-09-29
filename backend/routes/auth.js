import express from 'express';
import { getAuthController } from '../controllers/AuthController.js';
import {
    findUser,
    verifyPassword,
    createSession,
    getSessionUser,
    removeSession
} from "../services/auth.js";
import { jsonResponse } from "../services/response.js";

// Express Router Implementation
const router = express.Router();
router.use(express.json());

const authController = getAuthController();

router.post(['/login', '/api/auth/login'], authController.login);
router.post(['/switch-demo-role', '/api/auth/switch-demo-role'], authController.switchDemoRole);
router.get(['/me', '/api/auth/me'], authController.me);
router.post(['/logout', '/api/auth/logout'], authController.logout);
router.get(['/demo-roles', '/api/auth/demo-roles'], authController.getDemoRoles);
router.get(['/active-sessions', '/api/auth/active-sessions'], authController.getActiveSessions);

export { router as authRouter };
export default router;

// Web Standard / Cloudflare Worker Handler Compatibility
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

export async function switchDemoRole(request, DB) {
    try {
        const body = await request.json();
        const role = (body?.role || body?.username || "ADMIN").toUpperCase();

        let user = null;
        if (DB) {
            user = await DB
                .prepare("SELECT id, name, username, role FROM users WHERE UPPER(role) = ? LIMIT 1")
                .bind(role)
                .first();
        }

        if (!user) {
            const demoNames = {
                SUPER_ADMIN: "M. Fadillah, S.Kom",
                ADMIN: "Siti Rahmawati, A.Md",
                KEPALA_SEKOLAH: "Dra. Hj. Nurjanah, M.Pd.",
                GURU: "Budi Santoso, S.Pd",
                SISWA: "Ahmad Fauzi",
                ORANG_TUA: "H. Hendra Gunawan"
            };
            user = {
                id: 99,
                username: role.toLowerCase(),
                name: demoNames[role] || `${role} Demo User`,
                role: role
            };
        }

        const token = DB ? await createSession(DB, user.id) : `mv_demo_${role.toLowerCase()}_${Date.now()}`;

        return jsonResponse({
            success: true,
            token,
            user,
            message: `Beralih ke persona: ${user.name} (${user.role})`
        });
    } catch (error) {
        return jsonResponse({
            success: false,
            message: error.message || "Gagal switch demo role"
        }, 500);
    }
}
