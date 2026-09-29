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

export async function me(request, env) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '').trim();
    if (!token) {
      return Response.json({ authenticated: false, user: null });
    }

    const session = await env.DB
      .prepare(`
        SELECT u.id, u.name, u.username, u.role
        FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.token = ? AND s.expired_at > datetime('now')
      `)
      .bind(token)
      .first();

    return Response.json({
      authenticated: !!session,
      user: session || null
    });
  } catch (err) {
    return Response.json({ authenticated: false, user: null });
  }
}

export async function logout(request, env) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '').trim();
    if (token && env.DB) {
      await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    }
    return Response.json({ success: true, message: 'Logout successful' });
  } catch (err) {
    return Response.json({ success: true });
  }
}

export async function switchDemoRole(request, env) {
  try {
    const body = await request.json();
    const role = (body?.role || body?.username || 'ADMIN').toUpperCase();

    let user = null;
    if (env.DB) {
      user = await env.DB
        .prepare('SELECT id, name, username, role FROM users WHERE UPPER(role) = ? LIMIT 1')
        .bind(role)
        .first();
    }

    if (!user) {
      const demoNames = {
        SUPER_ADMIN: 'M. Fadillah, S.Kom',
        ADMIN: 'Siti Rahmawati, A.Md',
        KEPALA_SEKOLAH: 'Dra. Hj. Nurjanah, M.Pd.',
        GURU: 'Budi Santoso, S.Pd',
        SISWA: 'Ahmad Fauzi',
        ORANG_TUA: 'H. Hendra Gunawan'
      };
      user = {
        id: 99,
        username: role.toLowerCase(),
        name: demoNames[role] || `${role} User`,
        role: role
      };
    }

    const session = env.DB ? await createSession(env.DB, user.id) : { token: `mv_demo_${role.toLowerCase()}_${Date.now()}` };

    return Response.json({
      success: true,
      token: session.token || session,
      user,
      message: `Beralih ke persona: ${user.name} (${user.role})`
    });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
