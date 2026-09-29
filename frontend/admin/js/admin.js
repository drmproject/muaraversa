const user = JSON.parse(localStorage.getItem('muaraversa_user') || '{}');

const name = document.getElementById('userName');
const role = document.getElementById('userRole');

if (name && user.name) name.textContent = user.name;
if (role && user.role) role.textContent = user.role;

function setStat(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value ?? 0;
  }
}

function setDashboardLoading() {
  setStat('totalTeachers', '...');
  setStat('totalStudents', '...');
  setStat('totalClasses', '...');
}

function setDashboardError() {
  setStat('totalTeachers', 0);
  setStat('totalStudents', 0);
  setStat('totalClasses', 0);
}

async function loadStats() {
  setDashboardLoading();

  try {
    const response = await fetch('/api/stats');

    if (!response.ok) {
      throw new Error('Stats API gagal');
    }

    const data = await response.json();

    setStat('totalTeachers', data.teachers || 0);
    setStat('totalStudents', data.students || 0);
    setStat('totalClasses', data.classes || 0);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    setDashboardError();
  }
}

loadStats();
