import {
    healthCheck
} from "./routes/health.js";

import {
    apiInfo,
    databaseTest
} from "./routes/api.js";

import {
    login,
    me,
    logout,
    switchDemoRole
} from "./routes/auth.js";

import {
    getSessionUser
} from "./services/auth.js";

import {
    adminProfile
} from "./routes/admin.js";

import {
    users
} from "./routes/users.js";

import {
    teachers
} from "./routes/teachers.js";

import {
    students
} from "./routes/students.js";

import {
    classes
} from "./routes/classes.js";

import {
    school
} from "./routes/school.js";

import {
    dashboard
} from "./routes/dashboard.js";

import {
    jsonResponse
} from "./services/response.js";

async function getUser(request, DB) {
    const auth = request.headers.get("Authorization") || "";
    const token = auth.replace("Bearer ", "");
    return await getSessionUser(DB, token);
}

function deny(message, status) {
    return jsonResponse({ error: message }, status);
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/health") return jsonResponse(healthCheck());
        if (url.pathname === "/api") return jsonResponse(await apiInfo(env.DB));
        if (url.pathname === "/api/database-test") return jsonResponse(await databaseTest(env.DB));

        if ((url.pathname === "/api/login" || url.pathname === "/api/auth/login") && request.method === "POST") return await login(request, env.DB);
        if ((url.pathname === "/api/me" || url.pathname === "/api/auth/me") && request.method === "GET") return await me(request, env.DB);
        if ((url.pathname === "/api/logout" || url.pathname === "/api/auth/logout") && request.method === "POST") return await logout(request, env.DB);
        if ((url.pathname === "/api/switch-demo-role" || url.pathname === "/api/auth/switch-demo-role") && request.method === "POST") return await switchDemoRole(request, env.DB);

        const user = await getUser(request, env.DB);

        if (url.pathname === "/api/admin/profile" && request.method === "GET") {
            if (!user) return deny("Unauthorized", 401);
            if (user.role !== "admin") return deny("Forbidden", 403);
            return await adminProfile(request, env.DB);
        }

        if (url.pathname.startsWith("/api/dashboard")) {
            if (!user) return deny("Unauthorized", 401);
            return await dashboard(request, env.DB);
        }

        if (url.pathname.startsWith("/api/teachers")) {
            if (!user) return deny("Unauthorized", 401);
            if (!["admin", "operator"].includes(user.role) && request.method !== "GET") return deny("Forbidden", 403);
            return await teachers(request, env.DB);
        }

        if (url.pathname.startsWith("/api/students")) {
            if (!user) return deny("Unauthorized", 401);
            if (!["admin", "operator"].includes(user.role) && request.method !== "GET") return deny("Forbidden", 403);
            return await students(request, env.DB);
        }

        if (url.pathname.startsWith("/api/classes")) {
            if (!user) return deny("Unauthorized", 401);
            if (!["admin", "operator"].includes(user.role) && request.method !== "GET") return deny("Forbidden", 403);
            return await classes(request, env.DB);
        }

        if (url.pathname.startsWith("/api/school")) return await school(request, env.DB);
        if (url.pathname === "/api/users") return await users(request, env);

        return jsonResponse({
            app: "Muaraversa",
            message: "Backend Running",
            version: "0.1.0"
        });
    }
};
