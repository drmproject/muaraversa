import { createSession } from '../services/session-service.js';

export async function login(request, env) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json({
        success: false,
        message: 'Username and password required'
      }, { status: 400 });
    }

    if (!env.DB) {
      return Response.json({
        success: false,
        message: 'Database binding not configured'
      }, { status: 500 });
    }

    const user = await env.DB
      .prepare('SELECT id, name, username, role_id, status FROM users WHERE username = ?')
      .bind(username)
      .first();

    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 401 });
    }

    const session = await createSession(env.DB, user.id);

    return Response.json({
      success: true,
      message: 'Login successful',
      user,
      session
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
