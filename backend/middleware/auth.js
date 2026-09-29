/**
 * MUARAVERSA DIGITAL SCHOOL ECOSYSTEM
 * JWT Authentication & Session Security Middleware
 * File: backend/middleware/auth.js
 * 
 * Provides:
 * - JWT Token Generation (signJWT) using HMAC-SHA256
 * - JWT Token Verification (verifyJWT) with expiration check & timing-safe signature comparison
 * - Express Authentication Middleware (authMiddleware / requireAuth)
 * - Role-Based Access Control Middleware (requireRole)
 * - Dual compatibility for both Express (req, res, next) and Web API (request, DB)
 */

import crypto from 'crypto';
import { getAuthController } from '../controllers/AuthController.js';
import { getSessionUser } from '../services/auth.js';

// Secret key for JWT signing & verification (fallback to secure key in development)
export const JWT_SECRET = process.env.JWT_SECRET || 'muaraversa-jwt-secret-production-key-2026';
export const JWT_EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds

/**
 * Base64URL Encoding helper
 */
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64URL Decoding helper
 */
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Generate a standard signed JWT token (HS256)
 * @param {Object} payload User identity claims (id, username, role, email, etc.)
 * @param {string} [secret] Secret key
 * @param {number} [expiresIn] TTL in seconds
 * @returns {string} Encoded JWT token string
 */
export function signJWT(payload, secret = JWT_SECRET, expiresIn = JWT_EXPIRES_IN) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
}

/**
 * Verify a JWT token and return its payload if valid
 * @param {string} token
 * @param {string} [secret]
 * @returns {Object|null} Decoded payload or null if invalid/expired
 */
export function verifyJWT(token, secret = JWT_SECRET) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    // Constant-time buffer comparison to prevent timing attacks
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    // Verify expiration claim
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Extract token from request headers or query
 */
export function extractToken(req) {
  if (!req) return null;

  // Web API Request object (req.headers.get)
  if (req.headers && typeof req.headers.get === 'function') {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7).trim();
    }
    return authHeader.trim() || null;
  }

  // Express Request object (req.headers['authorization'])
  const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (authHeader) {
    return authHeader.trim();
  }

  // Fallback to custom header or query param
  if (req.headers?.['x-access-token']) {
    return req.headers['x-access-token'];
  }
  if (req.query?.token) {
    return req.query.token;
  }

  return null;
}

/**
 * Retrieve authenticated user from token
 * Resolves both JWT tokens and AuthController active sessions
 */
export async function getAuthUser(request, DB = null) {
  const token = extractToken(request);
  if (!token) return null;

  // 1. Check if token is a valid JWT
  const jwtPayload = verifyJWT(token);
  if (jwtPayload) {
    return {
      id: jwtPayload.id || jwtPayload.sub,
      username: jwtPayload.username,
      name: jwtPayload.name,
      role: jwtPayload.role,
      email: jwtPayload.email,
      avatar: jwtPayload.avatar
    };
  }

  // 2. Check AuthController active session store (mv_tok_*, mv_demo_*, admin_token_default)
  try {
    const authController = getAuthController();
    const session = authController?.getSession(token);
    if (session && session.user) {
      return session.user;
    }
  } catch (err) {
    // Continue
  }

  // 3. Fallback to SQL DB session lookup if DB binding provided
  if (DB) {
    try {
      return await getSessionUser(DB, token);
    } catch (err) {
      // Continue
    }
  }

  return null;
}

/**
 * Express Authentication Middleware:
 * Verifies JWT token or active session, attaches req.user, or returns 401.
 * Supports dual invocation for Express (req, res, next) and Web API (request, DB).
 */
export function requireAuth(req, res, next) {
  // Check if called as Express middleware: (req, res, next)
  if (res && typeof res.status === 'function' && typeof next === 'function') {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak: Token autentikasi JWT tidak ditemukan.'
      });
    }

    // 1. Verify JWT
    const decoded = verifyJWT(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      return next();
    }

    // 2. Verify Session token (mv_tok_*, mv_demo_*, admin_token_default)
    try {
      const authController = getAuthController();
      const session = authController?.getSession(token);
      if (session && session.user) {
        req.user = session.user;
        req.token = token;
        return next();
      }
    } catch (err) {
      // Fallback
    }

    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi JWT tidak valid atau telah kedaluwarsa.'
    });
  }

  // Web API / Cloudflare Worker invocation: requireAuth(request, DB)
  return (async () => {
    const user = await getAuthUser(req, res);
    if (!user) {
      throw new Error('Unauthorized');
    }
    return user;
  })();
}

/**
 * Role Authorization Middleware / Helper:
 * Ensures the authenticated user possesses one of the allowed roles.
 * Supports:
 * 1. Express Middleware: requireRole('ADMIN', 'SUPER_ADMIN') -> (req, res, next)
 * 2. Synchronous User check: requireRole(user, ['admin']) -> null if allowed, { error: 'Forbidden' } if denied
 * 3. Asynchronous Request check: await requireRole(request, DB, ['admin']) -> user or throws error
 */
export function requireRole(...args) {
  // Case 1: Synchronous user object check: requireRole(user, ['admin'])
  if (args[0] && typeof args[0] === 'object' && ('role' in args[0] || 'id' in args[0])) {
    const user = args[0];
    const rolesArg = args[1] || [];
    const allowed = (Array.isArray(rolesArg) ? rolesArg : [rolesArg]).map(r => String(r).toUpperCase());
    
    if (!user || !user.role) {
      return { success: false, error: 'Unauthorized', message: 'Sesi anda belum terautentikasi' };
    }
    if (user.role.toUpperCase() === 'SUPER_ADMIN' || allowed.includes(user.role.toUpperCase())) {
      return null; // No access error, access granted
    }
    return { success: false, error: 'Forbidden', message: `Akses dilarang. Diperlukan hak akses: ${allowed.join(', ')}` };
  }

  // Case 2: Asynchronous Web API check: await requireRole(request, DB, ['admin'])
  if (args[0] && (args[0].headers || typeof args[0].json === 'function' || args[0].method)) {
    const req = args[0];
    const DB = args[1] && typeof args[1].prepare === 'function' ? args[1] : null;
    const rolesArg = args[2] || args[1] || [];
    const allowed = (Array.isArray(rolesArg) ? rolesArg : [rolesArg]).map(r => String(r).toUpperCase());

    return (async () => {
      const user = await getAuthUser(req, DB);
      if (!user) {
        throw new Error('Unauthorized');
      }
      if (user.role?.toUpperCase() === 'SUPER_ADMIN' || allowed.includes(user.role?.toUpperCase())) {
        return user;
      }
      throw new Error('Forbidden');
    })();
  }

  // Case 3: Standard Express Middleware factory: requireRole('ADMIN', 'GURU')
  const allowed = args.flat().filter(Boolean).map(r => String(r).toUpperCase());

  return (req, res, next) => {
    // Check if called as Express middleware: (req, res, next)
    if (res && typeof res.status === 'function' && typeof next === 'function') {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Sesi anda belum terautentikasi'
        });
      }

      // SUPER_ADMIN has master privileges over all roles
      if (user.role?.toUpperCase() === 'SUPER_ADMIN' || allowed.includes(user.role?.toUpperCase())) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `Akses dilarang. Diperlukan hak akses: ${allowed.join(', ')}`
      });
    }

    // Direct invocation fallback: fn(req, res)
    return (async () => {
      const user = await getAuthUser(req, res);
      if (!user) {
        throw new Error('Unauthorized');
      }
      if (user.role?.toUpperCase() === 'SUPER_ADMIN' || allowed.includes(user.role?.toUpperCase())) {
        return user;
      }
      throw new Error('Forbidden');
    })();
  };
}

// Alias for authMiddleware
export const authMiddleware = requireAuth;

export default {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  signJWT,
  verifyJWT,
  extractToken,
  getAuthUser,
  requireAuth,
  requireRole,
  authMiddleware
};
