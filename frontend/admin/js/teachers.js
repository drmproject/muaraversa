async function loadTeachers(){
 const response = await fetch('/api/teachers');
 const data = await response.json();
 const tbody = document.querySelector('#teacherTable tbody');
 tbody.innerHTML='';
 (data.teachers || data || []).forEach(t=>{
  tbody.innerHTML += `<tr><td>${t.name || t.nama || ''}</td><td>${t.nip || ''}</td><td>${t.subject || t.mapel || ''}</td><td><button onclick="deleteTeacher(${t.id})">Hapus</button></td></tr>`;
 });
}

async function createTeacher(){
 const body={
  name:document.getElementById('teacherName').value,
  nip:document.getElementById('teacherNip').value,
  subject:document.getElementById('teacherSubject').value
 };
 await fetch('/api/teachers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 loadTeachers();
}

async function deleteTeacher(id){
 await fetch('/api/teachers/'+id,{method:'DELETE'});
 loadTeachers();
}

loadTeachers();