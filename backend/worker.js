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
    logout
} from "./routes/auth.js";

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

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/health") return jsonResponse(healthCheck());
        if (url.pathname === "/api") return jsonResponse(await apiInfo(env.DB));
        if (url.pathname === "/api/database-test") return jsonResponse(await databaseTest(env.DB));

        if (url.pathname === "/api/login" && request.method === "POST") return await login(request, env.DB);
        if (url.pathname === "/api/me" && request.method === "GET") return await me(request, env.DB);
        if (url.pathname === "/api/logout" && request.method === "POST") return await logout(request, env.DB);

        if (url.pathname === "/api/admin/profile" && request.method === "GET") return await adminProfile(request, env.DB);

        if (url.pathname.startsWith("/api/dashboard")) return await dashboard(request, env.DB);
        if (url.pathname.startsWith("/api/teachers")) return await teachers(request, env.DB);
        if (url.pathname.startsWith("/api/students")) return await students(request, env.DB);
        if (url.pathname.startsWith("/api/classes")) return await classes(request, env.DB);
        if (url.pathname.startsWith("/api/school")) return await school(request, env.DB);
        if (url.pathname === "/api/users") return await users(request, env);

        return jsonResponse({
            app: "Muaraversa",
            message: "Backend Running",
            version: "0.1.0"
        });
    }
};
