const user = JSON.parse(localStorage.getItem('muaraversa_user') || '{}');

const name = document.getElementById('userName');
const role = document.getElementById('userRole');

if(name && user.name) name.textContent = user.name;
if(role && user.role) role.textContent = user.role;

async function loadStats(){
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();

    const teachers = document.getElementById('totalTeachers');
    const students = document.getElementById('totalStudents');
    const classes = document.getElementById('totalClasses');

    if(teachers) teachers.textContent = data.teachers || 0;
    if(students) students.textContent = data.students || 0;
    if(classes) classes.textContent = data.classes || 0;
  } catch(error){
    console.error('Stats loading failed', error);
  }
}

loadStats();
