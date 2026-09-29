const API = '/api/classes';
const TEACHER_API = '/api/teachers';

async function getJson(url, options = {}) {
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
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadTeachers() {
  const select = document.getElementById('teacher_id');
  if (!select) return;

  try {
    const data = await getJson(TEACHER_API);
    const teachers = data.teachers || data.data || [];

    select.innerHTML = '<option value="">Pilih Wali Kelas</option>';

    teachers.forEach((teacher) => {
      select.innerHTML += `<option value="${teacher.id}">${escapeHtml(teacher.name || teacher.nama || 'Tanpa Nama')}</option>`;
    });
  } catch (error) {
    console.error(error);
    select.innerHTML = '<option value="">Gagal memuat guru</option>';
  }
}

async function loadClasses() {
  const list = document.getElementById('classList');
  if (!list) return;

  try {
    const data = await getJson(API);
    const classes = data.classes || data.data || [];

    list.innerHTML = classes.length
      ? classes.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.name || '-')}</td>
          <td>${escapeHtml(item.teacher_name || item.teacher_id || '-')}</td>
          <td>
            <button onclick="editClass(${item.id}, '${String(item.name || '').replaceAll("'", "\\'")}', ${item.teacher_id || 0})">Edit</button>
            <button onclick="deleteClass(${item.id})">Hapus</button>
          </td>
        </tr>`).join('')
      : '<tr><td colspan="4">Belum ada data kelas</td></tr>';
  } catch (error) {
    console.error(error);
    list.innerHTML = '<tr><td colspan="4">Gagal memuat data kelas</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTeachers();
  loadClasses();
});

const form = document.getElementById('classForm');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('class_id')?.value;
  const name = document.getElementById('name')?.value.trim();
  const teacherId = document.getElementById('teacher_id')?.value;

  if (!name || !teacherId) {
    alert('Nama kelas dan wali kelas wajib diisi');
    return;
  }

  try {
    await getJson(id ? `${API}/${id}` : API, {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify({ name, teacher_id: teacherId })
    });

    resetClassForm();
    loadClasses();
  } catch (error) {
    alert(error.message);
  }
});

function editClass(id, name, teacher) {
  document.getElementById('class_id').value = id;
  document.getElementById('name').value = name;
  document.getElementById('teacher_id').value = teacher;
}

function resetClassForm() {
  document.getElementById('class_id').value = '';
  document.getElementById('classForm')?.reset();
}

async function deleteClass(id) {
  if (!confirm('Hapus kelas?')) return;

  try {
    await getJson(`${API}/${id}`, { method: 'DELETE' });
    loadClasses();
  } catch (error) {
    alert(error.message);
  }
}
