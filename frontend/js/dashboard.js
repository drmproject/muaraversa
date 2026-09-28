const user = JSON.parse(localStorage.getItem('muaraversa_user') || '{}');

const userEl = document.getElementById('user');
const roleEl = document.getElementById('role');

if(userEl) userEl.textContent = `User: ${user.name || user.username || 'Guest'}`;
if(roleEl) roleEl.textContent = `Role: ${user.role || '-'}`;

function logout(){
  localStorage.removeItem('muaraversa_token');
  localStorage.removeItem('muaraversa_user');
  window.location.href='login.html';
}
