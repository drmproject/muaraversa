const API = '/api/teachers';
let editingId = null;
let isProcessing = false;

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request gagal');
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
    tbody.innerHTML = '<tr><td colspan="4">Memuat data guru...</td></tr>';
    const response = await request(API);
    const teachers = response.data || response.teachers || response || [];

    tbody.innerHTML = teachers.length ? teachers.map((teacher) => `
      <tr>
        <td>${escapeHtml(teacher.name || '-')}</td>
        <td>${escapeHtml(teacher.nip || '-')}</td>
        <td>${escapeHtml(teacher.subject || '-')}</td>
        <td>
          <button onclick="editTeacher(${teacher.id}, '${String(teacher.name || '').replace(/'/g, "\\'")}', '${String(teacher.nip || '').replace(/'/g, "\\'")}', '${String(teacher.subject || '').replace(/'/g, "\\'")}')">Edit</button>
          <button onclick="deleteTeacher(${teacher.id})">Hapus</button>
        </td>
      </tr>
    `).join('') : '<tr><td colspan="4">Belum ada data guru</td></tr>';
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="4">Gagal memuat data guru</td></tr>';
    console.error(error);
  }
}

const form = document.getElementById('teacherForm');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isProcessing) return;

  const payload = {
    name: document.getElementById('name')?.value.trim(),
    nip: document.getElementById('nip')?.value.trim(),
    subject: document.getElementById('subject')?.value.trim()
  };

  if (!payload.name) {
    alert('Nama guru wajib diisi');
    return;
  }

  isProcessing = true;

  try {
    await request(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });

    editingId = null;
    form.reset();
    await loadTeachers();
  } catch (error) {
    alert(error.message);
  } finally {
    isProcessing = false;
  }
});

function editTeacher(id, name, nip, subject) {
  editingId = id;
  document.getElementById('name').value = name;
  document.getElementById('nip').value = nip;
  document.getElementById('subject').value = subject;
}

async function deleteTeacher(id) {
  if (!confirm('Hapus data guru?')) return;

  try {
    await request(`${API}/${id}`, { method: 'DELETE' });
    await loadTeachers();
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', loadTeachers);
