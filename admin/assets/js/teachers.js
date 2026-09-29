const API = '/api/teachers';

async function loadTeachers() {
  const tbody = document.querySelector('#teacherTableBody');
  if (!tbody) return;

  try {
    const res = await fetch(API);
    const data = await res.json();

    tbody.innerHTML = '';
    (data.data || data || []).forEach((teacher, index) => {
      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${teacher.name || ''}</td>
          <td>${teacher.nip || ''}</td>
          <td>${teacher.subject || ''}</td>
          <td>
            <button onclick="deleteTeacher(${teacher.id})">Hapus</button>
          </td>
        </tr>`;
    });
  } catch (error) {
    console.error('Gagal memuat guru:', error);
  }
}

async function addTeacher(payload) {
  await fetch(API, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  loadTeachers();
}

async function deleteTeacher(id) {
  if (!confirm('Hapus data guru?')) return;

  await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });

  loadTeachers();
}

document.addEventListener('DOMContentLoaded', loadTeachers);
