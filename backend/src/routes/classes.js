export async function classRoutes(request, env) {
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const result = await env.DB.prepare(
      'SELECT * FROM classes ORDER BY id DESC'
    ).all();

    return Response.json(result.results || []);
  }

  if (request.method === 'POST') {
    const body = await request.json();

    const result = await env.DB.prepare(
      'INSERT INTO classes (name, level, teacher_id) VALUES (?, ?, ?)'
    )
      .bind(body.name, body.level, body.teacher_id || null)
      .run();

    return Response.json({
      success: true,
      id: result.meta.last_row_id
    });
  }

  return Response.json({
    module: 'classes',
    message: 'Method not supported'
  }, { status: 405 });
}
