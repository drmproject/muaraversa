export async function statsRoute(request, env) {
  const teachers = await env.DB.prepare('SELECT COUNT(*) as total FROM teachers').first();
  const students = await env.DB.prepare('SELECT COUNT(*) as total FROM students').first();
  const classes = await env.DB.prepare('SELECT COUNT(*) as total FROM classes').first();
  const school = await env.DB.prepare('SELECT * FROM school LIMIT 1').first();

  return new Response(JSON.stringify({
    teachers: teachers?.total || 0,
    students: students?.total || 0,
    classes: classes?.total || 0,
    school: school || null
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
