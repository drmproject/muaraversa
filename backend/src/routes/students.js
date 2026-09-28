export async function studentRoutes(request, env) {
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const result = await env.DB.prepare('SELECT * FROM students').all();
    return Response.json({
      module: 'students',
      data: result.results
    });
  }

  if (request.method === 'POST') {
    const body = await request.json();

    await env.DB.prepare(
      'INSERT INTO students (name, nis, class_id) VALUES (?, ?, ?)'
    )
      .bind(body.name, body.nis, body.class_id)
      .run();

    return Response.json({
      success: true,
      message: 'Student created'
    });
  }

  return Response.json({
    module: 'students',
    message: 'Method not supported'
  }, { status: 405 });
}
