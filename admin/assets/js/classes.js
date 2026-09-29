const API = '/api/classes';
const TEACHER_API = '/api/teachers';

async function loadTeachers(){
 const select=document.getElementById('teacher_id');
 if(!select) return;
 const res=await fetch(TEACHER_API);
 const data=await res.json();
 select.innerHTML='<option value="">Pilih Wali Kelas</option>';
 (data.teachers||data.data||[]).forEach(t=>{
  select.innerHTML += `<option value="${t.id}">${t.name||t.nama||''}</option>`;
 });
}

async function loadClasses(){
 const list=document.getElementById('classList');
 if(!list) return;
 const res=await fetch(API);
 const data=await res.json();
 list.innerHTML='';
 (data.classes||data.data||[]).forEach((item,i)=>{
  list.innerHTML += `<tr><td>${i+1}</td><td>${item.name||''}</td><td>${item.teacher_name||item.teacher_id||''}</td><td><button onclick="editClass(${item.id},'${item.name||''}',${item.teacher_id||''})">Edit</button> <button onclick="deleteClass(${item.id})">Hapus</button></td></tr>`;
 });
}

document.addEventListener('DOMContentLoaded',()=>{
 loadTeachers();
 loadClasses();
});

const form=document.getElementById('classForm');
if(form){
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  const id=document.getElementById('class_id').value;
  const payload={
   name:document.getElementById('name').value,
   teacher_id:document.getElementById('teacher_id').value
  };
  await fetch(id?`${API}/${id}`:API,{
   method:id?'PUT':'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(payload)
  });
  resetClassForm();
  loadClasses();
 });
}

function editClass(id,name,teacher){
 document.getElementById('class_id').value=id;
 document.getElementById('name').value=name;
 document.getElementById('teacher_id').value=teacher;
}

function resetClassForm(){
 const id=document.getElementById('class_id');
 if(id) id.value='';
 document.getElementById('classForm')?.reset();
}

async function deleteClass(id){
 if(!confirm('Hapus kelas?')) return;
 await fetch(`${API}/${id}`,{method:'DELETE'});
 loadClasses();
}
