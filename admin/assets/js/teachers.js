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

    tbody.innerHTML = teachers.map((teacher) => `
      <tr>
        <td>${teacher.name || ''}</td>
        <td>${teacher.nip || ''}</td>
        <td>${teacher.subject || ''}</td>
        <td>
          <button onclick="editTeacher(${teacher.id}, '${teacher.name || ''}', '${teacher.nip || ''}', '${teacher.subject || ''}')">Edit</button>
          <button onclick="deleteTeacher(${teacher.id})">Hapus</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error(error.message);
  }
}

const form = document.getElementById('teacherForm');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      name: document.getElementById('name').value,
      nip: document.getElementById('nip').value,
      subject: document.getElementById('subject').value
    };

    const response = await fetch(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? 'PUT' : 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if (!response.ok) return;

    editingId = null;
    form.reset();
    loadTeachers();
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

  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadTeachers();
}

document.addEventListener('DOMContentLoaded', loadTeachers);
