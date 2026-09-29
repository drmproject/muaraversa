const form = document.getElementById('loginForm');

const AUTH_KEY = 'admin_session';
const SESSION_VALUE = 'active';

function saveSession() {
  localStorage.setItem(AUTH_KEY, SESSION_VALUE);
  localStorage.setItem('login_time', Date.now().toString());
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem('login_time');
}

function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === SESSION_VALUE;
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
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!username || !password) {
      alert('Username dan password wajib diisi.');
      return;
    }

    saveSession();
    window.location.href = 'dashboard.html';
  });
}

function requireAdmin() {
  if (!isAuthenticated() || !checkSessionTimeout()) {
    window.location.href = 'login.html';
  }
}

function logoutAdmin() {
  clearSession();
  window.location.href = 'login.html';
}
