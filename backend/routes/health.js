// Health Check Route

export function healthCheck() {

    return {
        status: "ok",
        app: "Muaraversa",
        version: "0.1.0",
        message: "API Running"
    };

}
