import { requireAuth } from "../middleware/auth.js";
import { writeAudit } from "../services/audit.js";

export async function students(request, DB) {

    if (!DB) {
        return Response.json({ error: "Database not configured" }, { status: 500 });
    }

    const user = await requireAuth(request, DB);

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (request.method === "GET") {
        const result = await DB.prepare("SELECT * FROM students ORDER BY id DESC").all();
        return Response.json({ students: result.results || [] });
    }

    if (request.method === "POST") {
        const body = await request.json();
        await DB.prepare(
            "INSERT INTO students (name, nis, class_id) VALUES (?, ?, ?)"
        ).bind(body.name, body.nis, body.class_id).run();

        await writeAudit(DB, user.id, "ADD_STUDENT", body.name || "");

        return Response.json({ success: true });
    }

    if (request.method === "PUT") {
        const body = await request.json();
        await DB.prepare(
            "UPDATE students SET name = ?, nis = ?, class_id = ? WHERE id = ?"
        ).bind(body.name, body.nis, body.class_id, id).run();

        await writeAudit(DB, user.id, "UPDATE_STUDENT", id);

        return Response.json({ success: true });
    }

    if (request.method === "DELETE") {
        await DB.prepare("DELETE FROM students WHERE id = ?")
            .bind(id)
            .run();

        await writeAudit(DB, user.id, "DELETE_STUDENT", id);

        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
