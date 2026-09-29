/**
 * MUARAVERSA DIGITAL SCHOOL ECOSYSTEM
 * Frontend Authentication & Session Client
 * File: frontend/js/auth.js
 */

const AUTH_CONFIG = {
  TOKEN_KEY: 'muaraversa_token',
  JWT_KEY: 'muaraversa_jwt',
  USER_KEY: 'muaraversa_user',
  API_LOGIN: '/api/login',
  API_LOGOUT: '/api/logout',
  API_ME: '/api/auth/me',
  API_SWITCH_ROLE: '/api/auth/switch-demo-role'
};

/**
 * Get current stored auth token (JWT or session token)
 */
function getToken() {
  return localStorage.getItem(AUTH_CONFIG.JWT_KEY) || localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) || 'admin_token_default';
}

/**
 * Get current stored user profile
 */
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * User login handler
 */
async function login(username, password) {
  if (!username && !password) {
    username = document.getElementById('username')?.value?.trim();
    password = document.getElementById('password')?.value?.trim();
  }

  if (!username || !password) {
    alert('Username dan kata sandi wajib diisi');
    return null;
  }

  try {
    const response = await fetch(AUTH_CONFIG.API_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    if (data.success && (data.token || data.jwt)) {
      if (data.token) localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, data.token);
      if (data.jwt) localStorage.setItem(AUTH_CONFIG.JWT_KEY, data.jwt);
      if (data.user) {
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(data.user));
      }
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Login gagal, periksa username dan password Anda');
    }

    return data;
  } catch (err) {
    console.error('Login error:', err);
    alert('Terjadi kesalahan saat masuk ke sistem. Silakan coba kembali.');
    return null;
  }
}

/**
 * Switch Demo Role (Quick persona switcher for evaluation)
 */
async function switchDemoRole(role) {
  try {
    const token = getToken();
    const response = await fetch(AUTH_CONFIG.API_SWITCH_ROLE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });

    const data = await response.json();
    if (data.success && (data.token || data.jwt)) {
      if (data.token) localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, data.token);
      if (data.jwt) localStorage.setItem(AUTH_CONFIG.JWT_KEY, data.jwt);
      if (data.user) {
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(data.user));
      }
      // Reload or navigate to dashboard
      if (window.location.pathname.includes('dashboard')) {
        window.location.reload();
      } else {
        window.location.href = 'dashboard.html';
      }
    }
    return data;
  } catch (err) {
    console.error('switchDemoRole error:', err);
    return null;
  }
}

/**
 * Logout handler
 */
async function logout() {
  const token = getToken();
  try {
    await fetch(AUTH_CONFIG.API_LOGOUT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (err) {
    console.warn('Logout API warning:', err);
  } finally {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.JWT_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    window.location.href = 'login.html';
  }
}

/**
 * Verify current session with server
 */
async function checkAuth() {
  const token = getToken();
  try {
    const response = await fetch(AUTH_CONFIG.API_ME, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data && data.authenticated && data.user) {
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(data.user));
      return data.user;
    }
    return null;
  } catch (err) {
    console.warn('checkAuth error:', err);
    return null;
  }
}

// Export to global window scope for HTML onclick bindings
if (typeof window !== 'undefined') {
  window.login = login;
  window.logout = logout;
  window.switchDemoRole = switchDemoRole;
  window.getToken = getToken;
  window.getCurrentUser = getCurrentUser;
  window.checkAuth = checkAuth;
}
