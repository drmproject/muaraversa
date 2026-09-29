async function loadStudents(){
 try{
  const res=await fetch('/api/students');
  const data=await res.json();
  const list=document.getElementById('studentList');
  list.innerHTML='';
  (data.students||[]).forEach(s=>{
   list.innerHTML += `<tr><td>${s.name||''}</td><td>${s.nis||''}</td><td>${s.class_id||''}</td><td><button onclick="deleteStudent(${s.id})">Hapus</button></td></tr>`;
  });
 }catch(e){console.log(e)}
}

async function addStudent(){
 await fetch('/api/students',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({
   name:document.getElementById('name').value,
   nis:document.getElementById('nis').value,
   class_id:document.getElementById('class_id').value
  })
 });
 loadStudents();
}

async function deleteStudent(id){
 await fetch('/api/students/'+id,{method:'DELETE'});
 loadStudents();
}

loadStudents();