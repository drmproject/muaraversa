async function loadSchool(){
 const name=document.getElementById('school-name');
 const address=document.getElementById('school-address');
 try{
  const res=await fetch('/api/school');
  if(!res.ok) throw new Error('Gagal memuat');
  const data=await res.json();
  const school=data.school || data.data || data;
  if(name) name.value=school.name || '';
  if(address) address.value=school.address || '';
 }catch(e){
  console.error('School load error',e);
 }
}

async function saveSchool(e){
 e.preventDefault();
 try{
  const res=await fetch('/api/school',{
   method:'PUT',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({
    name:document.getElementById('school-name').value,
    address:document.getElementById('school-address').value
   })
  });
  document.getElementById('school-message').textContent=res.ok?'Tersimpan':'Gagal menyimpan';
 }catch(e){
  document.getElementById('school-message').textContent='Gagal menyimpan';
 }
}

document.getElementById('school-form')?.addEventListener('submit',saveSchool);
loadSchool();