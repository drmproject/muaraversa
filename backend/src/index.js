export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return Response.json({
        status: 'ok',
        project: 'Muaraversa'
      });
    }

    return Response.json({
      message: 'Muaraversa API Foundation'
    });
  }
};
