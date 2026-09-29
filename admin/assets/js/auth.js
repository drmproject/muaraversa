const form = document.getElementById('loginForm');

const AUTH_KEY = 'admin_session';
const SESSION_VALUE = 'active';

function saveSession() {
  localStorage.setItem(AUTH_KEY, SESSION_VALUE);
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === SESSION_VALUE;
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
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

function logoutAdmin() {
  clearSession();
  window.location.href = 'login.html';
}
