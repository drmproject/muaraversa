export async function school(request, DB) {

    if (!DB) {
        return Response.json({ error: "Database not configured" }, { status: 500 });
    }

    if (request.method === "GET") {
        const result = await DB.prepare("SELECT * FROM schools LIMIT 1").all();
        return Response.json({ school: result.results?.[0] || null });
    }

    if (request.method === "POST" || request.method === "PUT") {
        const body = await request.json();

        await DB.prepare(
            "UPDATE schools SET name = ?, address = ? WHERE id = 1"
        ).bind(body.name, body.address).run();

        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
