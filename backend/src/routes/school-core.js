import { getSchools, getTeachers, getStudents, getClasses } from '../services/school-service.js';

export async function schoolCore(request, env) {
  const url = new URL(request.url);

  if (url.pathname.endsWith('/school')) {
    return Response.json(await getSchools(env.DB));
  }

  if (url.pathname.endsWith('/teachers')) {
    return Response.json(await getTeachers(env.DB));
  }

  if (url.pathname.endsWith('/students')) {
    return Response.json(await getStudents(env.DB));
  }

  if (url.pathname.endsWith('/classes')) {
    return Response.json(await getClasses(env.DB));
  }

  return Response.json({error:'Route not found'}, {status:404});
}
