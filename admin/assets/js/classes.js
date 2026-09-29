const API = '/api/classes';
const TEACHER_API = '/api/teachers';

async function getJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

async function loadTeachers() {
  const select = document.getElementById('teacher_id');
  if (!select) return;

  try {
    const data = await getJson(TEACHER_API);
    const teachers = data.teachers || data.data || [];

    select.innerHTML = '<option value="">Pilih Wali Kelas</option>';

    if (!teachers.length) {
      select.innerHTML += '<option value="">Data guru kosong</option>';
      return;
    }

    teachers.forEach((teacher) => {
      select.innerHTML += `<option value="${teacher.id}">${teacher.name || teacher.nama || 'Tanpa Nama'}</option>`;
    });
  } catch (error) {
    console.error('Gagal memuat guru:', error);
    select.innerHTML = '<option value="">Gagal memuat guru</option>';
  }
}

async function loadClasses() {
  const list = document.getElementById('classList');
  if (!list) return;

  try {
    const data = await getJson(API);
    const classes = data.classes || data.data || [];

    list.innerHTML = '';

    if (!classes.length) {
      list.innerHTML = '<tr><td colspan="4">Belum ada data kelas</td></tr>';
      return;
    }

    classes.forEach((item, index) => {
      list.innerHTML += `<tr><td>${index + 1}</td><td>${item.name || '-'}</td><td>${item.teacher_name || item.teacher_id || '-'}</td><td><button onclick="editClass(${item.id}, '${(item.name || '').replace(/'/g, "\\'")}', ${item.teacher_id || 0})">Edit</button> <button onclick="deleteClass(${item.id})">Hapus</button></td></tr>`;
    });
  } catch (error) {
    console.error('Gagal memuat kelas:', error);
    list.innerHTML = '<tr><td colspan="4">Gagal memuat data kelas</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTeachers();
  loadClasses();
});

const form = document.getElementById('classForm');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const teacherInput = document.getElementById('teacher_id');
    const id = document.getElementById('class_id').value;

    const name = nameInput.value.trim();
    const teacherId = teacherInput.value;

    if (!name) {
      alert('Nama kelas wajib diisi');
      return;
    }

    if (!teacherId) {
      alert('Wali kelas wajib dipilih');
      return;
    }

    const payload = {
      name,
      teacher_id: teacherId
    };

    try {
      await getJson(id ? `${API}/${id}` : API, {
        method: id ? 'PUT' : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      resetClassForm();
      await loadClasses();
    } catch (error) {
      console.error('Gagal menyimpan kelas:', error);
      alert(error.message || 'Gagal menyimpan data kelas');
    }
  });
}

function editClass(id, name, teacher) {
  document.getElementById('class_id').value = id;
  document.getElementById('name').value = name;
  document.getElementById('teacher_id').value = teacher;
}

function resetClassForm() {
  const id = document.getElementById('class_id');
  if (id) id.value = '';
  document.getElementById('classForm')?.reset();
}

async function deleteClass(id) {
  if (!confirm('Hapus kelas?')) return;

  try {
    await getJson(`${API}/${id}`, {method: 'DELETE'});
    await loadClasses();
  } catch (error) {
    console.error('Gagal menghapus kelas:', error);
    alert(error.message || 'Gagal menghapus kelas');
  }
}
