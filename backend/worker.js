import {
    healthCheck
} from "./routes/health.js";

import {
    apiInfo
} from "./routes/api.js";

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

        return jsonResponse({
            app: "Muaraversa",
            message: "Backend Running",
            version: "0.1.0"
        });

    }

};
