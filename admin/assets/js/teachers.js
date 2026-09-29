const API = '/api/teachers';
let editingId = null;

async function getTeachers() {
  const response = await fetch(API);
  if (!response.ok) throw new Error('Gagal mengambil data guru');
  return response.json();
}

async function loadTeachers() {
  const tbody = document.querySelector('#teacherList') || document.querySelector('#teacherTableBody');
  if (!tbody) return;

  try {
    const response = await getTeachers();
    const teachers = response.data || response.teachers || response || [];

    tbody.innerHTML = teachers.length ? teachers.map((teacher) => `
      <tr>
        <td>${teacher.name || ''}</td>
        <td>${teacher.nip || ''}</td>
        <td>${teacher.subject || ''}</td>
        <td>
          <button onclick="editTeacher(${teacher.id}, '${teacher.name || ''}', '${teacher.nip || ''}', '${teacher.subject || ''}')">Edit</button>
          <button onclick="deleteTeacher(${teacher.id})">Hapus</button>
        </td>
      </tr>
    `).join('') : '<tr><td colspan="4">Belum ada data guru</td></tr>';
  } catch (error) {
    console.error('Teachers load error:', error.message);
  }
}

const form = document.getElementById('teacherForm');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      name: document.getElementById('name').value.trim(),
      nip: document.getElementById('nip').value.trim(),
      subject: document.getElementById('subject').value.trim()
    };

    if (!payload.name) {
      alert('Nama guru wajib diisi');
      return;
    }

    try {
      const response = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? 'PUT' : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Gagal menyimpan data guru');

      editingId = null;
      form.reset();
      loadTeachers();
    } catch (error) {
      console.error('Teachers save error:', error.message);
    }
  });
}

function editTeacher(id, name, nip, subject) {
  editingId = id;
  document.getElementById('name').value = name;
  document.getElementById('nip').value = nip;
  document.getElementById('subject').value = subject;
}

async function deleteTeacher(id) {
  if (!confirm('Hapus data guru?')) return;

  const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!response.ok) return;

  loadTeachers();
}

document.addEventListener('DOMContentLoaded', loadTeachers);
