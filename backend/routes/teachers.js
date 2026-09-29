import { writeAudit } from "../services/audit.js";

export async function teachers(request, DB) {

    if (!DB) {
        return Response.json({ error: "Database not configured" }, { status: 500 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const userId = request.user?.id || null;

    if (request.method === "GET") {
        const result = await DB.prepare("SELECT * FROM teachers ORDER BY id DESC").all();
        return Response.json({ teachers: result.results || [] });
    }

    if (request.method === "POST") {
        const body = await request.json();

        if (!body.name) {
            return Response.json({ error: "Teacher name required" }, { status: 400 });
        }

        await DB.prepare("INSERT INTO teachers (name, nip, subject) VALUES (?, ?, ?)")
            .bind(body.name, body.nip || "", body.subject || "")
            .run();

        await writeAudit(DB, userId, "ADD_TEACHER", body.name);

        return Response.json({ success: true });
    }

    if (request.method === "PUT") {
        const body = await request.json();

        if (!id || !body.name) {
            return Response.json({ error: "Invalid teacher data" }, { status: 400 });
        }

        await DB.prepare("UPDATE teachers SET name = ?, nip = ?, subject = ? WHERE id = ?")
            .bind(body.name, body.nip || "", body.subject || "", id)
            .run();

        await writeAudit(DB, userId, "UPDATE_TEACHER", id);

        return Response.json({ success: true });
    }

    if (request.method === "DELETE") {
        await DB.prepare("DELETE FROM teachers WHERE id = ?")
            .bind(id)
            .run();

        await writeAudit(DB, userId, "DELETE_TEACHER", id);

        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
