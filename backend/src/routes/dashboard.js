import { requireRole } from '../middleware/role-middleware.js';

export async function dashboard(request, env, user) {
  const role = user?.role || user?.role_name || 'UNKNOWN';

  const allowed = requireRole(role, [
    'ADMIN',
    'KEPALA_SEKOLAH',
    'GURU',
    'SISWA',
    'ORANG_TUA'
  ]);

  if (!allowed) {
    return Response.json({
      success: false,
      message: 'Access denied'
    }, { status: 403 });
  }

  return Response.json({
    success: true,
    dashboard: {
      role,
      message: `Welcome ${role} to Muaraversa Dashboard`
    }
  });
}
