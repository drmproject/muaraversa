export async function teacherRoutes(request, env) {
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    const result = await env.DB.prepare(
      'SELECT * FROM teachers ORDER BY id DESC'
    ).all();

    return Response.json(result.results || []);
  }

  if (method === 'POST') {
    const body = await request.json();

    await env.DB.prepare(
      'INSERT INTO teachers (name, nip, subject) VALUES (?, ?, ?)'
    )
      .bind(body.name, body.nip, body.subject)
      .run();

    return Response.json({ message: 'Teacher created' });
  }

  return Response.json({
    module: 'teachers',
    message: 'Method not supported yet'
  }, { status: 405 });
}
