export async function dashboard(request, DB) {

    if (!DB) {
        return Response.json({ error: "Database not configured" }, { status: 500 });
    }

    if (request.method !== "GET") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const teachers = await DB.prepare("SELECT COUNT(*) as total FROM teachers").first();
    const students = await DB.prepare("SELECT COUNT(*) as total FROM students").first();
    const classes = await DB.prepare("SELECT COUNT(*) as total FROM classes").first();
    const school = await DB.prepare("SELECT * FROM schools LIMIT 1").first();

    return Response.json({
        total_guru: teachers?.total || 0,
        total_siswa: students?.total || 0,
        total_kelas: classes?.total || 0,
        sekolah: school || null
    });
}
