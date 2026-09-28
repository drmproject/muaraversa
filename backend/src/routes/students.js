export async function studentRoutes(request, env) {
  return Response.json({
    module: 'students',
    message: 'Student API ready'
  });
}
