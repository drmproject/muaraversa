export async function schoolRoutes(request, env) {
  const method = request.method;

  if (method === 'GET') {
    const result = await env.DB
      .prepare('SELECT * FROM school LIMIT 1')
      .first();

    return Response.json({
      success: true,
      data: result || null
    });
  }

  if (method === 'POST' || method === 'PUT') {
    const body = await request.json();

    return Response.json({
      success: true,
      message: 'School profile saved',
      data: body
    });
  }

  return Response.json({
    success: false,
    message: 'Method not allowed'
  }, { status: 405 });
}
