async function loadSchool(){
 const target=document.getElementById('school-data');
 try{
  const res=await fetch('/api/school');
  const data=await res.json();
  target.innerHTML=JSON.stringify(data,null,2);
 }catch(e){
  target.innerHTML='Data sekolah belum tersedia';
 }
}
loadSchool();