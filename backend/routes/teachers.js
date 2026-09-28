export async function teachers(request, DB) {

    if (!DB) {
        return Response.json({ error: "Database not configured" }, { status: 500 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (request.method === "GET") {
        const result = await DB.prepare("SELECT * FROM teachers ORDER BY id DESC").all();
        return Response.json({ teachers: result.results || [] });
    }

    if (request.method === "POST") {
        const body = await request.json();
        await DB.prepare(
            "INSERT INTO teachers (name, nip, subject) VALUES (?, ?, ?)"
        ).bind(body.name, body.nip, body.subject).run();

        return Response.json({ success: true });
    }

    if (request.method === "DELETE") {
        await DB.prepare("DELETE FROM teachers WHERE id = ?")
            .bind(id)
            .run();

        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
