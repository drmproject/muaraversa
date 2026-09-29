import express from 'express';
import { getAuthController, AuthController } from '../backend/controllers/AuthController.js';
import { requireAuth, requireRole } from '../backend/middleware/auth.js';

const router = express.Router();

// Middleware to ensure JSON body parsing is supported for all auth routes
router.use(express.json());

/**
 * Route Factory to bind with a custom AuthController instance
 */
export function createAuthRouter(controller) {
  const auth = controller || getAuthController();
  const r = express.Router();
  r.use(express.json());

  r.post(['/login', '/api/auth/login'], auth.login);
  r.post(['/switch-demo-role', '/api/auth/switch-demo-role'], auth.switchDemoRole);
  r.get(['/me', '/api/auth/me'], auth.me);
  r.post(['/logout', '/api/auth/logout'], auth.logout);
  r.get(['/demo-roles', '/api/auth/demo-roles'], auth.getDemoRoles);
  r.get(['/active-sessions', '/api/auth/active-sessions'], auth.getActiveSessions);

  return r;
}

/**
 * @route   POST /api/auth/login and /login
 * @desc    Authenticate user credentials, return session token and sanitized user
 */
router.post(['/login', '/api/auth/login'], (req, res, next) => {
  return getAuthController().login(req, res, next);
});

/**
 * @route   POST /api/auth/switch-demo-role and /switch-demo-role
 * @desc    Fast persona switcher for multi-role demo evaluation in frontend quick-login utility
 */
router.post(['/switch-demo-role', '/api/auth/switch-demo-role'], (req, res, next) => {
  return getAuthController().switchDemoRole(req, res, next);
});

/**
 * @route   GET /api/auth/me and /me
 * @desc    Retrieve authenticated profile & session status
 */
router.get(['/me', '/api/auth/me'], (req, res, next) => {
  return getAuthController().me(req, res, next);
});

/**
 * @route   POST /api/auth/logout and /logout
 * @desc    Invalidate token & destroy session
 */
router.post(['/logout', '/api/auth/logout'], (req, res, next) => {
  return getAuthController().logout(req, res, next);
});

/**
 * @route   GET /api/auth/demo-roles and /demo-roles
 * @desc    List available demo personas for quick-login UI
 */
router.get(['/demo-roles', '/api/auth/demo-roles'], (req, res, next) => {
  return getAuthController().getDemoRoles(req, res, next);
});

/**
 * @route   GET /api/auth/verify
 * @desc    Validate JWT or Session token using auth middleware
 */
router.get(['/verify', '/api/auth/verify'], requireAuth, (req, res) => {
  return res.json({
    success: true,
    message: 'Token valid dan terverifikasi',
    user: req.user
  });
});

/**
 * @route   GET /api/auth/active-sessions and /active-sessions
 * @desc    List currently active user sessions
 */
router.get(['/active-sessions', '/api/auth/active-sessions'], (req, res, next) => {
  return getAuthController().getActiveSessions(req, res, next);
});

export { router as authRouter, getAuthController, AuthController };
export default router;
