async function loadTeachers(){
 const response = await fetch('/api/teachers');
 const data = await response.json();
 const tbody = document.querySelector('#teacherTable tbody');
 tbody.innerHTML='';
 (data.teachers || data || []).forEach(t=>{
  tbody.innerHTML += `<tr><td>${t.name || t.nama || ''}</td><td>${t.nip || ''}</td><td>${t.subject || t.mapel || ''}</td></tr>`;
 });
}
loadTeachers();