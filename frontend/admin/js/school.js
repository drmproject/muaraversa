async function loadSchool(){
 const target=document.getElementById('school-data');
 if(!target) return;

 try{
  const res=await fetch('/api/school');

  if(!res.ok){
   throw new Error('Gagal memuat data sekolah');
  }

  const data=await res.json();
  const school=data.data || data;

  target.innerHTML=`
   <div class="school-profile">
    <h2>${school.name || '-'}</h2>
    <p>NPSN: ${school.npsn || '-'}</p>
    <p>Alamat: ${school.address || '-'}</p>
   </div>
  `;
 }catch(e){
  target.innerHTML='Data sekolah belum tersedia';
 }
}

loadSchool();