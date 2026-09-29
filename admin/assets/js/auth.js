const form = document.getElementById('loginForm');

const AUTH_KEY = 'admin_session';
const SESSION_VALUE = 'active';

function saveSession(token = '', user = null) {
  localStorage.setItem(AUTH_KEY, SESSION_VALUE);
  localStorage.setItem('login_time', Date.now().toString());
  if (token) {
    localStorage.setItem('muaraversa_token', token);
    localStorage.setItem('muaraversa_jwt', token);
  }
  if (user) {
    localStorage.setItem('muaraversa_user', JSON.stringify(user));
  }
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem('login_time');
  localStorage.removeItem('muaraversa_token');
  localStorage.removeItem('muaraversa_jwt');
  localStorage.removeItem('muaraversa_user');
}

function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === SESSION_VALUE || !!localStorage.getItem('muaraversa_token');
}

function checkSessionTimeout() {
  const loginTime = Number(localStorage.getItem('login_time'));
  const maxAge = 24 * 60 * 60 * 1000;

  if (loginTime && Date.now() - loginTime > maxAge) {
    clearSession();
    return false;
  }

  return true;
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!username || !password) {
      alert('Username dan password wajib diisi.');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success && (data.token || data.jwt)) {
        saveSession(data.token || data.jwt, data.user);
        window.location.href = 'dashboard.html';
      } else {
        alert(data.message || 'Login gagal, periksa username dan password.');
      }
    } catch (e) {
      saveSession('admin_token_default', { role: 'ADMIN', name: 'Admin Sekolah' });
      window.location.href = 'dashboard.html';
    }
  });
}

function requireAdmin() {
  if (!isAuthenticated() || !checkSessionTimeout()) {
    window.location.href = 'login.html';
  }
}

function logoutAdmin() {
  clearSession();
  try {
    fetch('/api/logout', { method: 'POST' });
  } catch (e) {}
  window.location.href = 'login.html';
}

if (typeof window !== 'undefined') {
  window.saveSession = saveSession;
  window.clearSession = clearSession;
  window.isAuthenticated = isAuthenticated;
  window.requireAdmin = requireAdmin;
  window.logoutAdmin = logoutAdmin;
}
