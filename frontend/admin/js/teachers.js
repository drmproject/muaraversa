async function loadTeachers(){
 const response = await fetch('/api/teachers');
 const data = await response.json();
 const tbody = document.querySelector('#teacherTable tbody');
 tbody.innerHTML='';
 (data.teachers || data || []).forEach(t=>{
  tbody.innerHTML += `<tr><td>${t.name || ''}</td><td>${t.nip || ''}</td><td>${t.subject || ''}</td><td><button onclick="editTeacher(${t.id}, '${t.name || ''}', '${t.nip || ''}', '${t.subject || ''}')">Edit</button><button onclick="deleteTeacher(${t.id})">Hapus</button></td></tr>`;
 });
}

async function createTeacher(){
 const id=document.getElementById('teacherId').value;
 const body={
  name:document.getElementById('teacherName').value,
  nip:document.getElementById('teacherNip').value,
  subject:document.getElementById('teacherSubject').value
 };
 const url=id ? '/api/teachers/'+id : '/api/teachers';
 await fetch(url,{method:id?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 cancelEdit();
 loadTeachers();
}

function editTeacher(id,name,nip,subject){
 document.getElementById('teacherId').value=id;
 document.getElementById('teacherName').value=name;
 document.getElementById('teacherNip').value=nip;
 document.getElementById('teacherSubject').value=subject;
}

function cancelEdit(){
 document.getElementById('teacherId').value='';
}

async function deleteTeacher(id){
 await fetch('/api/teachers/'+id,{method:'DELETE'});
 loadTeachers();
}

loadTeachers();