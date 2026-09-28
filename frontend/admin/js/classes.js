const API = '/api/classes';

async function loadClasses(){
  const tbody = document.querySelector('#classesTable tbody');
  if(!tbody) return;
  try{
    const res = await fetch(API);
    const data = await res.json();
    const rows = data.data || data || [];
    tbody.innerHTML = rows.map((item,index)=>`
      <tr>
        <td>${index+1}</td>
        <td>${item.name || item.nama_kelas || '-'}</td>
        <td>${item.level || item.tingkat || '-'}</td>
        <td>${item.teacher || item.wali_kelas || '-'}</td>
      </tr>`).join('');
  }catch(err){
    tbody.innerHTML='<tr><td colspan="4">Data belum tersedia</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded',loadClasses);