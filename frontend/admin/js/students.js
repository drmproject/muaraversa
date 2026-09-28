async function loadStudents(){
 const res = await fetch('/api/students');
 const data = await res.json();
 const tbody = document.querySelector('#studentsTable tbody');
 (data.students || []).forEach(s=>{
  tbody.innerHTML += `<tr><td>${s.nis||''}</td><td>${s.name||''}</td><td>${s.class||''}</td></tr>`;
 });
}
loadStudents();