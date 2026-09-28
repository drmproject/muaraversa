export async function teacherRoutes(request, env) {
  return Response.json({
    module: 'teachers',
    message: 'Teacher API ready'
  });
}
