import { writeAudit } from "../services/audit.js";

export async function classes(request, DB) {
    if (!DB) {
        return Response.json({ error: "Database not configured" }, { status: 500 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const userId = request.user?.id || null;

    if (request.method === "GET") {
        const result = await DB.prepare("SELECT * FROM classes ORDER BY id DESC").all();
        return Response.json({ classes: result.results || [] });
    }

    if (request.method === "POST") {
        const body = await request.json();

        if (!body.name) {
            return Response.json({ error: "Class name is required" }, { status: 400 });
        }

        await DB.prepare("INSERT INTO classes (name, teacher_id) VALUES (?, ?)")
            .bind(body.name, body.teacher_id || null).run();
        await writeAudit(DB, userId, "CREATE_CLASS", body.name);

        return Response.json({ success: true });
    }

    if (request.method === "PUT") {
        const body = await request.json();

        if (!body.name) {
            return Response.json({ error: "Class name is required" }, { status: 400 });
        }

        await DB.prepare("UPDATE classes SET name = ?, teacher_id = ? WHERE id = ?")
            .bind(body.name, body.teacher_id || null, id).run();
        await writeAudit(DB, userId, "UPDATE_CLASS", id);

        return Response.json({ success: true });
    }

    if (request.method === "DELETE") {
        await DB.prepare("DELETE FROM classes WHERE id = ?").bind(id).run();
        await writeAudit(DB, userId, "DELETE_CLASS", id);
        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
