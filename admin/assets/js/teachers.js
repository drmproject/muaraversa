const API = '/api/teachers';
let editingId = null;

function getTeachers() {
  return fetch(API).then(r => r.json());
}

async function loadTeachers() {
  const tbody = document.querySelector('#teacherList') || document.querySelector('#teacherTableBody');
  if (!tbody) return;

  try {
    const response = await getTeachers();
    const teachers = response.data || response || [];

    tbody.innerHTML = '';

    teachers.forEach((teacher) => {
      tbody.innerHTML += `
        <tr>
          <td>${teacher.name || ''}</td>
          <td>${teacher.nip || ''}</td>
          <td>${teacher.subject || ''}</td>
          <td>
            <button onclick="editTeacher(${teacher.id}, '${teacher.name || ''}', '${teacher.nip || ''}', '${teacher.subject || ''}')">Edit</button>
            <button onclick="deleteTeacher(${teacher.id})">Hapus</button>
          </td>
        </tr>`;
    });
  } catch (error) {
    console.error('Gagal memuat guru:', error);
  }
}

const form = document.getElementById('teacherForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById('name').value,
      nip: document.getElementById('nip').value,
      subject: document.getElementById('subject').value
    };

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/${editingId}` : API;

    await fetch(url, {
      method,
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

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

  await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });

  loadTeachers();
}

document.addEventListener('DOMContentLoaded', loadTeachers);
