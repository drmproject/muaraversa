const API='';
async function loadDashboard(){
 try{
  const res=await fetch(API+'/api/dashboard');
  const data=await res.json();
  document.getElementById('teachers').textContent=data.total_guru||0;
  document.getElementById('students').textContent=data.total_siswa||0;
  document.getElementById('classes').textContent=data.total_kelas||0;
  document.getElementById('school').textContent=data.profil_sekolah?.name||'-';
 }catch(e){console.log(e)}
}
loadDashboard();