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
    jsonResponse
} from "./services/response.js";


export default {

    async fetch(request, env) {

        const url = new URL(request.url);

        if (url.pathname === "/api/health") {
            return jsonResponse(
                healthCheck()
            );
        }

        if (url.pathname === "/api") {
            return jsonResponse(
                await apiInfo(env.DB)
            );
        }

        if (url.pathname === "/api/database-test") {
            return jsonResponse(
                await databaseTest(env.DB)
            );
        }

        if (url.pathname === "/api/login" && request.method === "POST") {
            return await login(request, env.DB);
        }

        if (url.pathname === "/api/me" && request.method === "GET") {
            return await me(request, env.DB);
        }

        if (url.pathname === "/api/logout" && request.method === "POST") {
            return await logout(request, env.DB);
        }

        if (url.pathname === "/api/admin/profile" && request.method === "GET") {
            return await adminProfile(request, env.DB);
        }

        if (url.pathname === "/api/users") {
            return await users(request, env);
        }

        return jsonResponse({
            app: "Muaraversa",
            message: "Backend Running",
            version: "0.1.0"
        });

    }

};
