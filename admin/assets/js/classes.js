const API = '/api/classes';
const TEACHER_API = '/api/teachers';

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Request failed');
  return response.json();
}

async function loadTeachers() {
  const select = document.getElementById('teacher_id');
  if (!select) return;

  try {
    const data = await getJson(TEACHER_API);
    const teachers = data.teachers || data.data || [];
    select.innerHTML = '<option value="">Pilih Wali Kelas</option>';
    teachers.forEach((teacher) => {
      select.innerHTML += `<option value="${teacher.id}">${teacher.name || teacher.nama || ''}</option>`;
    });
  } catch (error) {
    console.error('Gagal memuat guru:', error);
  }
}

async function loadClasses() {
  const list = document.getElementById('classList');
  if (!list) return;

  try {
    const data = await getJson(API);
    const classes = data.classes || data.data || [];

    list.innerHTML = '';
    classes.forEach((item, index) => {
      list.innerHTML += `<tr><td>${index + 1}</td><td>${item.name || ''}</td><td>${item.teacher_name || item.teacher_id || ''}</td><td><button onclick="editClass(${item.id}, '${item.name || ''}', ${item.teacher_id || 0})">Edit</button> <button onclick="deleteClass(${item.id})">Hapus</button></td></tr>`;
    });
  } catch (error) {
    console.error('Gagal memuat kelas:', error);
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

    const id = document.getElementById('class_id').value;
    const payload = {
      name: document.getElementById('name').value,
      teacher_id: document.getElementById('teacher_id').value
    };

    try {
      await fetch(id ? `${API}/${id}` : API, {
        method: id ? 'PUT' : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      resetClassForm();
      loadClasses();
    } catch (error) {
      console.error('Gagal menyimpan kelas:', error);
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
    await fetch(`${API}/${id}`, {method: 'DELETE'});
    loadClasses();
  } catch (error) {
    console.error('Gagal menghapus kelas:', error);
  }
}
