const API = '/api/classes';

async function loadClasses(){
 const list=document.getElementById('classList');
 if(!list) return;
 const res=await fetch(API);
 const data=await res.json();
 list.innerHTML='';
 (data.classes||data.data||[]).forEach((item,i)=>{
  list.innerHTML += `<tr><td>${i+1}</td><td>${item.name||''}</td><td>${item.teacher_id||''}</td><td><button onclick="deleteClass(${item.id})">Hapus</button></td></tr>`;
 });
}

document.addEventListener('DOMContentLoaded',loadClasses);

const form=document.getElementById('classForm');
if(form){
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('name').value,teacher_id:document.getElementById('teacher_id').value})});
  form.reset();
  loadClasses();
 });
}

async function deleteClass(id){
 if(!confirm('Hapus kelas?')) return;
 await fetch(`${API}/${id}`,{method:'DELETE'});
 loadClasses();
}
