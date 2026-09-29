async function loadStudents(){
 try{
  const res=await fetch('/api/students');
  const data=await res.json();
  const list=document.getElementById('studentList');
  list.innerHTML='';
  (data.students||[]).forEach(s=>{
   list.innerHTML += `<tr><td>${s.name||''}</td><td>${s.nis||''}</td><td>${s.class_id||''}</td></tr>`;
  });
 }catch(e){console.log(e)}
}
loadStudents();