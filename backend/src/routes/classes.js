export async function classRoutes(request, env) {
  return Response.json({
    module: 'classes',
    message: 'Classes API ready'
  });
}
