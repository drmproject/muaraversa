const user = JSON.parse(localStorage.getItem('muaraversa_user') || '{}');

const userEl = document.getElementById('user');
const roleEl = document.getElementById('role');
const guruEl = document.getElementById('total-guru');
const siswaEl = document.getElementById('total-siswa');
const kelasEl = document.getElementById('total-kelas');

if (userEl) userEl.textContent = `User: ${user.name || user.username || 'Guest'}`;
if (roleEl) roleEl.textContent = `Role: ${user.role || '-'}`;

async function loadDashboard(){
  try {
    const response = await fetch('/api/dashboard');
    if (!response.ok) throw new Error('Dashboard API failed');

    const data = await response.json();

    if (guruEl) guruEl.textContent = data.total_guru || 0;
    if (siswaEl) siswaEl.textContent = data.total_siswa || 0;
    if (kelasEl) kelasEl.textContent = data.total_kelas || 0;
  } catch (error) {
    console.error('Dashboard error:', error);
  }
}

loadDashboard();

function logout(){
  localStorage.removeItem('muaraversa_token');
  localStorage.removeItem('muaraversa_user');
  window.location.href='login.html';
}
