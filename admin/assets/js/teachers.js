const API = '/api/teachers';
let editingId = null;

async function getTeachers() {
  const response = await fetch(API);
  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil data guru');
  }

  return data;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function loadTeachers() {
  const tbody = document.querySelector('#teacherList') || document.querySelector('#teacherTableBody');
  if (!tbody) return;

  try {
    const response = await getTeachers();
    const teachers = response.data || response.teachers || response || [];

    tbody.innerHTML = teachers.length ? teachers.map((teacher) => `
      <tr>
        <td>${escapeHtml(teacher.name)}</td>
        <td>${escapeHtml(teacher.nip)}</td>
        <td>${escapeHtml(teacher.subject)}</td>
        <td>
          <button onclick="editTeacher(${teacher.id}, '${escapeHtml(teacher.name)}', '${escapeHtml(teacher.nip)}', '${escapeHtml(teacher.subject)}')">Edit</button>
          <button onclick="deleteTeacher(${teacher.id})">Hapus</button>
        </td>
      </tr>
    `).join('') : '<tr><td colspan="4">Belum ada data guru</td></tr>';
  } catch (error) {
    console.error('Teachers load error:', error.message);
    tbody.innerHTML = '<tr><td colspan="4">Gagal memuat data guru</td></tr>';
  }
}

const form = document.getElementById('teacherForm');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      name: document.getElementById('name')?.value.trim(),
      nip: document.getElementById('nip')?.value.trim(),
      subject: document.getElementById('subject')?.value.trim()
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
      alert(error.message);
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

  try {
    const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Gagal menghapus data guru');
    loadTeachers();
  } catch (error) {
    console.error('Teachers delete error:', error.message);
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', loadTeachers);
