export async function schoolRoutes(request, env) {
  return Response.json({
    module: 'school',
    message: 'School API ready'
  });
}
