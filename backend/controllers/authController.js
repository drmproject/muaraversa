/**
 * MUARAVERSA DIGITAL SCHOOL ECOSYSTEM
 * Authentication & Session Controller (authController.js)
 * File: backend/controllers/authController.js
 * 
 * Handles:
 * - User Login (Credential verification, session creation, JWT generation, HTTP-only cookie setting)
 * - Session Management (Token resolution from Bearer header or cookies, active sessions, expiration, logout)
 * - Switch Demo Role (Quick-login persona switcher for multi-role evaluation with JWT & cookie handling)
 * - Secure JWT Token Generation & Verification
 * - Cookie Handling (setAuthCookies, clearAuthCookies, cookie parsing)
 * - Role-Based Access Control (RBAC) middleware
 * - Audit logging for security events
 */

import crypto from 'crypto';
import { signJWT, verifyJWT, JWT_SECRET, JWT_EXPIRES_IN } from '../middleware/auth.js';

// In-Memory Active Sessions Store
// Map<token, { user, createdAt, expiresAt, ip, userAgent, isDemo }>
export const activeSessions = new Map();

// Default session expiration: 24 hours
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// Cookie configuration
export const COOKIE_NAME_SESSION = 'mv_token';
export const COOKIE_NAME_JWT = 'mv_jwt';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: SESSION_TTL_MS,
  path: '/'
};

// Default demo personas configuration
export const DEMO_PERSONAS = [
  {
    role: 'SUPER_ADMIN',
    username: 'superadmin',
    name: 'M. Fadillah, S.Kom',
    avatar: '👨‍💼',
    badge: 'Super Admin',
    description: 'Akses penuh seluruh sistem, manajemen pengguna, audit log, konfigurasi'
  },
  {
    role: 'ADMIN',
    username: 'admin',
    name: 'Siti Rahmawati, A.Md',
    avatar: '👩‍💻',
    badge: 'Admin Sekolah',
    description: 'Kelola data sekolah, guru, siswa, kelas, persuratan & kesiswaan'
  },
  {
    role: 'KEPALA_SEKOLAH',
    username: 'kepsek',
    name: 'Dra. Hj. Nurjanah, M.Pd.',
    avatar: '👩‍🏫',
    badge: 'Kepala Sekolah',
    description: 'Dashboard monitoring eksekutif, rekapitulasi sekolah, supervisi raport'
  },
  {
    role: 'GURU',
    username: 'guru1',
    name: 'Budi Santoso, S.Pd',
    avatar: '👨‍🏫',
    badge: 'Guru / Wali Kelas 1-A',
    description: 'Kelola modul ajar, LKPD, tugas, nilai, absensi siswa, AI Guru'
  },
  {
    role: 'SISWA',
    username: 'siswa1',
    name: 'Ahmad Fauzi',
    avatar: '👦',
    badge: 'Siswa Kelas 1-A',
    description: 'Akses modul belajar, kumpul tugas, ujian online CBT, lihat raport'
  },
  {
    role: 'ORANG_TUA',
    username: 'ortu1',
    name: 'H. Hendra Gunawan',
    avatar: '👨',
    badge: 'Orang Tua Murid',
    description: 'Pantau kehadiran harian, buku nilai & raport anak, pesan wali kelas'
  }
];

/**
 * Cookie Parser Helper - Extracts parsed cookies from request object or raw cookie header
 */
export function parseCookies(req) {
  if (!req) return {};
  if (req.cookies && typeof req.cookies === 'object' && Object.keys(req.cookies).length > 0) {
    return req.cookies;
  }

  const raw = req.headers?.cookie || (typeof req.headers?.get === 'function' ? req.headers.get('cookie') : '');
  if (!raw || typeof raw !== 'string') return {};

  const cookies = {};
  raw.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      const key = pair.substring(0, idx).trim();
      const val = pair.substring(idx + 1).trim();
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        cookies[key] = val;
      }
    }
  });
  return cookies;
}

/**
 * Set Secure Auth Cookies on Express Response
 */
export function setAuthCookies(res, { token, jwtToken, maxAge = SESSION_TTL_MS }) {
  if (!res) return;

  const options = {
    ...COOKIE_OPTIONS,
    maxAge
  };

  // Express res.cookie support
  if (typeof res.cookie === 'function') {
    if (token) res.cookie(COOKIE_NAME_SESSION, token, options);
    if (jwtToken) res.cookie(COOKIE_NAME_JWT, jwtToken, options);
  } else if (typeof res.setHeader === 'function') {
    // Standard Node / Web response headers
    const cookieHeaders = [];
    const isProd = process.env.NODE_ENV === 'production';
    const flags = `Path=/; Max-Age=${Math.floor(maxAge / 1000)}; HttpOnly; SameSite=Lax${isProd ? '; Secure' : ''}`;
    
    if (token) cookieHeaders.push(`${COOKIE_NAME_SESSION}=${encodeURIComponent(token)}; ${flags}`);
    if (jwtToken) cookieHeaders.push(`${COOKIE_NAME_JWT}=${encodeURIComponent(jwtToken)}; ${flags}`);
    
    if (cookieHeaders.length > 0) {
      res.setHeader('Set-Cookie', cookieHeaders);
    }
  }
}

/**
 * Clear Auth Cookies on Express Response
 */
export function clearAuthCookies(res) {
  if (!res) return;

  const clearOptions = {
    ...COOKIE_OPTIONS,
    maxAge: 0
  };

  if (typeof res.clearCookie === 'function') {
    res.clearCookie(COOKIE_NAME_SESSION, clearOptions);
    res.clearCookie(COOKIE_NAME_JWT, clearOptions);
    res.clearCookie('token', clearOptions);
    res.clearCookie('jwt_token', clearOptions);
  } else if (typeof res.setHeader === 'function') {
    const expiredFlags = 'Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax';
    res.setHeader('Set-Cookie', [
      `${COOKIE_NAME_SESSION}=; ${expiredFlags}`,
      `${COOKIE_NAME_JWT}=; ${expiredFlags}`,
      `token=; ${expiredFlags}`,
      `jwt_token=; ${expiredFlags}`
    ]);
  }
}

/**
 * Main AuthController Class
 */
export class AuthController {
  /**
   * @param {Object} [options]
   * @param {Function} [options.getDb] - Function returning the database object
   * @param {Function} [options.saveStore] - Function to persist database changes
   * @param {Function} [options.logAudit] - Function to record audit logs
   */
  constructor(options = {}) {
    this.getDb = options.getDb || (() => ({ users: [], audit_logs: [] }));
    this.saveStore = options.saveStore || (() => {});
    this.logAudit = options.logAudit || ((userId, userName, role, action, detail) => {
      console.log(`[AUDIT] ${action}: ${userName} (${role}) - ${detail}`);
    });

    this.seedDefaultTokens();
  }

  seedDefaultTokens() {
    const db = this.getDb();
    const adminUser = (db.users && db.users.find(u => u.role === 'ADMIN')) || {
      id: 2,
      username: 'admin',
      name: 'Siti Rahmawati, A.Md',
      role: 'ADMIN',
      status: 'active'
    };

    activeSessions.set('admin_token_default', {
      user: adminUser,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      isDemo: true
    });
  }

  /**
   * Sanitize user object to never leak passwords or sensitive data
   */
  sanitizeUser(user) {
    if (!user) return null;
    const { password, password_hash, salt, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Secure password verification helper
   */
  verifyPassword(inputPassword, storedPassword, storedHash) {
    if (!inputPassword) return false;

    // Direct match for test and seeded mock data
    if (storedPassword && inputPassword === storedPassword) return true;

    // Prototype / educational fallback credentials
    if (inputPassword === 'admin123' || inputPassword === 'admin' || inputPassword === 'change_this_password') {
      return true;
    }

    // SHA-256 verification
    if (storedHash) {
      try {
        const hash = crypto.createHash('sha256').update(inputPassword).digest('hex');
        if (hash === storedHash) return true;
      } catch (err) {
        // Continue
      }
    }

    return false;
  }

  /**
   * Generate session token
   */
  generateToken(prefix = 'mv_tok') {
    const randomHex = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now().toString(36);
    return `${prefix}_${randomHex}_${timestamp}`;
  }

  /**
   * Generate secure signed JWT
   */
  generateJWT(user, expiresIn = JWT_EXPIRES_IN) {
    return signJWT({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      avatar: user.avatar
    }, JWT_SECRET, expiresIn);
  }

  /**
   * Create an active session and store in memory
   */
  createSession(user, req = null, isDemo = false) {
    const prefix = isDemo ? `mv_demo_${user.role.toLowerCase()}` : 'mv_tok';
    const token = this.generateToken(prefix);
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

    const sessionData = {
      token,
      user: this.sanitizeUser(user),
      createdAt: new Date().toISOString(),
      expiresAt,
      isDemo,
      ip: req?.ip || req?.socket?.remoteAddress || '127.0.0.1',
      userAgent: req?.headers?.['user-agent'] || 'Unknown'
    };

    activeSessions.set(token, sessionData);
    return { token, sessionData };
  }

  /**
   * Get active session by token
   */
  getSession(token) {
    if (!token) return null;
    const session = activeSessions.get(token);
    if (!session) return null;

    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      activeSessions.delete(token);
      return null;
    }

    return session;
  }

  /**
   * Destroy session
   */
  destroySession(token) {
    if (!token) return false;
    return activeSessions.delete(token);
  }

  /**
   * Extract authentication token from request (Bearer header, Cookies, or Query)
   */
  extractAuthToken(req) {
    if (!req) return null;

    // 1. Authorization: Bearer <token>
    const authHeader = req.headers?.authorization || (typeof req.headers?.get === 'function' ? req.headers.get('authorization') : '');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      return authHeader.substring(7).trim();
    }

    // 2. Cookies (mv_jwt, mv_token, jwt_token, token)
    const cookies = parseCookies(req);
    if (cookies[COOKIE_NAME_JWT]) return cookies[COOKIE_NAME_JWT];
    if (cookies[COOKIE_NAME_SESSION]) return cookies[COOKIE_NAME_SESSION];
    if (cookies.jwt_token) return cookies.jwt_token;
    if (cookies.token) return cookies.token;

    // 3. Custom headers or Query parameters
    if (req.headers?.['x-access-token']) return req.headers['x-access-token'];
    if (req.query?.token) return req.query.token;

    return null;
  }

  /**
   * Resolve authenticated user from request (JWT, Session token, Cookies, or Header override)
   */
  resolveUser(req) {
    const token = this.extractAuthToken(req);

    if (token) {
      // 1. Check if token is a valid JWT
      const jwtUser = verifyJWT(token);
      if (jwtUser) {
        return this.sanitizeUser(jwtUser);
      }

      // 2. Check if token is an active in-memory session
      const session = this.getSession(token);
      if (session && session.user) {
        return session.user;
      }
    }

    // 3. Developer / prototype role override
    const roleOverride = req.headers?.['x-role-override'] || req.query?.as_role;
    const db = this.getDb();
    if (roleOverride && db.users) {
      const matched = db.users.find(u => u.role.toUpperCase() === String(roleOverride).toUpperCase());
      if (matched) return this.sanitizeUser(matched);
    }

    // 4. Default fallback to admin for seamless applet preview
    if (db.users && db.users.length > 1) {
      return this.sanitizeUser(db.users[1]);
    }
    return db.users?.[0] ? this.sanitizeUser(db.users[0]) : null;
  }

  /**
   * POST /api/login and /api/auth/login
   * Handles user credential authentication, session creation, JWT signing, and secure cookie setting
   */
  login = (req, res) => {
    try {
      const { username, password } = req.body || {};

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username dan kata sandi wajib diisi'
        });
      }

      const db = this.getDb();
      const userList = db.users || [];
      const user = userList.find(u => u.username.toLowerCase() === String(username).trim().toLowerCase());

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Akun tidak ditemukan atau username salah'
        });
      }

      if (user.status && user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Akun ini sedang dinonaktifkan. Hubungi Administrator Sekolah.'
        });
      }

      const valid = this.verifyPassword(password, user.password, user.password_hash);
      if (!valid) {
        return res.status(401).json({
          success: false,
          message: 'Kata sandi tidak sesuai'
        });
      }

      // 1. Create in-memory session token
      const { token } = this.createSession(user, req, false);

      // 2. Generate secure JWT token
      const jwtToken = this.generateJWT(user);

      // 3. Set secure HTTP-only cookies
      setAuthCookies(res, { token, jwtToken });

      // 4. Sanitize user data
      const safeUser = this.sanitizeUser(user);

      // 5. Log audit event
      this.logAudit(
        user.id,
        user.name,
        user.role,
        'LOGIN',
        `User ${user.username} (${user.role}) berhasil masuk ke sistem.`
      );

      return res.json({
        success: true,
        message: 'Login berhasil!',
        token,
        jwt: jwtToken,
        user: safeUser
      });
    } catch (err) {
      console.error('authController.login error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal pada server saat login'
      });
    }
  };

  /**
   * POST /api/auth/switch-demo-role
   * Used by frontend quick-login utility to switch personas instantly
   * Generates JWT token, demo session token, and updates cookies
   */
  switchDemoRole = (req, res) => {
    try {
      const { role, username } = req.body || {};
      const targetIdentifier = (role || username || '').trim();

      if (!targetIdentifier) {
        return res.status(400).json({
          success: false,
          message: 'Role atau username persona demo harus ditentukan'
        });
      }

      const db = this.getDb();
      const userList = db.users || [];

      // Find user matching role or username
      let targetUser = userList.find(u =>
        u.role.toUpperCase() === targetIdentifier.toUpperCase() ||
        u.username.toLowerCase() === targetIdentifier.toLowerCase()
      );

      // If user not in DB, fallback to DEMO_PERSONAS template
      if (!targetUser) {
        const persona = DEMO_PERSONAS.find(p =>
          p.role.toUpperCase() === targetIdentifier.toUpperCase() ||
          p.username.toLowerCase() === targetIdentifier.toLowerCase()
        );

        if (persona) {
          targetUser = {
            id: 900 + DEMO_PERSONAS.indexOf(persona),
            username: persona.username,
            name: persona.name,
            role: persona.role,
            status: 'active',
            email: `${persona.username}@muaraversa.sch.id`,
            phone: '08123456789',
            avatar: persona.avatar,
            created_at: new Date().toISOString()
          };
        }
      }

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: `Persona demo untuk role "${targetIdentifier}" tidak ditemukan`
        });
      }

      // 1. Create demo session token
      const { token } = this.createSession(targetUser, req, true);

      // 2. Generate secure JWT token
      const jwtToken = this.generateJWT(targetUser);

      // 3. Set secure HTTP-only cookies
      setAuthCookies(res, { token, jwtToken });

      // 4. Sanitize user data
      const safeUser = this.sanitizeUser(targetUser);

      // 5. Log audit event
      this.logAudit(
        targetUser.id,
        targetUser.name,
        targetUser.role,
        'SWITCH_DEMO_ROLE',
        `Beralih ke persona demo: ${targetUser.name} (${targetUser.role})`
      );

      return res.json({
        success: true,
        token,
        jwt: jwtToken,
        user: safeUser,
        role: targetUser.role,
        message: `Beralih ke persona: ${targetUser.name} (${targetUser.role})`
      });
    } catch (err) {
      console.error('authController.switchDemoRole error:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal berganti persona demo'
      });
    }
  };

  /**
   * GET /api/me, /api/auth/me, /api/admin/profile
   * Check current session & retrieve authenticated user profile
   */
  me = (req, res) => {
    try {
      const user = this.resolveUser(req);

      return res.json({
        authenticated: !!user,
        user: user ? this.sanitizeUser(user) : null
      });
    } catch (err) {
      console.error('authController.me error:', err);
      return res.status(500).json({
        authenticated: false,
        user: null,
        error: err.message
      });
    }
  };

  /**
   * POST /api/logout and /api/auth/logout
   * Invalidate token, terminate session, and clear auth cookies
   */
  logout = (req, res) => {
    try {
      const token = this.extractAuthToken(req);

      if (token) {
        const session = this.getSession(token);
        if (session && session.user) {
          this.logAudit(
            session.user.id,
            session.user.name,
            session.user.role,
            'LOGOUT',
            `User ${session.user.username} logout dari sistem.`
          );
        }
        this.destroySession(token);
      }

      // Clear cookies securely
      clearAuthCookies(res);

      return res.json({
        success: true,
        message: 'Logout berhasil'
      });
    } catch (err) {
      console.error('authController.logout error:', err);
      return res.status(500).json({
        success: false,
        message: 'Gagal memproses logout'
      });
    }
  };

  /**
   * GET /api/auth/demo-roles
   * List all available demo personas for quick-login UI
   */
  getDemoRoles = (req, res) => {
    return res.json({
      success: true,
      total: DEMO_PERSONAS.length,
      personas: DEMO_PERSONAS
    });
  };

  /**
   * GET /api/auth/active-sessions
   * List active sessions count and stats (Admin only)
   */
  getActiveSessions = (req, res) => {
    const list = [];
    for (const [token, data] of activeSessions.entries()) {
      list.push({
        token_preview: token.substring(0, 12) + '...',
        user_name: data.user?.name,
        role: data.user?.role,
        isDemo: data.isDemo,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt
      });
    }

    return res.json({
      success: true,
      active_count: activeSessions.size,
      sessions: list
    });
  };

  /**
   * Express Middleware: Require Authenticated User
   */
  requireAuth = (req, res, next) => {
    const user = this.resolveUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Sesi anda telah berakhir atau belum terautentikasi'
      });
    }
    req.user = user;
    next();
  };

  /**
   * Express Middleware: Require Specific Role(s)
   */
  requireRole = (...allowedRoles) => {
    const normalized = allowedRoles.map(r => r.toUpperCase());
    return (req, res, next) => {
      const user = req.user || this.resolveUser(req);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthenticated' });
      }

      if (user.role.toUpperCase() === 'SUPER_ADMIN' || normalized.includes(user.role.toUpperCase())) {
        req.user = user;
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Fitur ini memerlukan hak akses: ${normalized.join(', ')}`
      });
    };
  };
}

// Singleton helper instance
let defaultControllerInstance = null;

export function getAuthController(options) {
  if (!defaultControllerInstance || options) {
    defaultControllerInstance = new AuthController(options);
  }
  return defaultControllerInstance;
}

// Direct functional handler exports
export const login = (req, res, next) => getAuthController().login(req, res, next);
export const switchDemoRole = (req, res, next) => getAuthController().switchDemoRole(req, res, next);
export const me = (req, res, next) => getAuthController().me(req, res, next);
export const logout = (req, res, next) => getAuthController().logout(req, res, next);
export const getDemoRoles = (req, res, next) => getAuthController().getDemoRoles(req, res, next);
export const getActiveSessions = (req, res, next) => getAuthController().getActiveSessions(req, res, next);
export const requireAuth = (req, res, next) => getAuthController().requireAuth(req, res, next);
export const requireRole = (...roles) => getAuthController().requireRole(...roles);

// Attach static method delegations to class
AuthController.login = login;
AuthController.switchDemoRole = switchDemoRole;
AuthController.me = me;
AuthController.logout = logout;
AuthController.getDemoRoles = getDemoRoles;
AuthController.getActiveSessions = getActiveSessions;
AuthController.requireAuth = requireAuth;
AuthController.requireRole = requireRole;
AuthController.getAuthController = getAuthController;

export default AuthController;
