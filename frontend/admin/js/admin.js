const user = JSON.parse(localStorage.getItem('muaraversa_user') || '{}');

const name = document.getElementById('userName');
const role = document.getElementById('userRole');

if(name && user.name) name.textContent = user.name;
if(role && user.role) role.textContent = user.role;
