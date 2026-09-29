async function loadStudents() {
    try {
        const res = await fetch('/api/students');

        if (!res.ok) {
            throw new Error('Gagal memuat data siswa');
        }

        const data = await res.json();
        const list = document.getElementById('studentList');

        if (!list) return;

        list.innerHTML = '';

        (data.students || []).forEach((student) => {
            list.innerHTML += `
                <tr>
                    <td>${student.name || '-'}</td>
                    <td>${student.nis || '-'}</td>
                    <td>${student.class_id || '-'}</td>
                    <td>
                        <button onclick="deleteStudent(${student.id})">Hapus</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Students load error:', error);
    }
}

async function addStudent() {
    const name = document.getElementById('name')?.value.trim();
    const nis = document.getElementById('nis')?.value.trim();
    const class_id = document.getElementById('class_id')?.value.trim();

    if (!name || !nis) {
        alert('Nama dan NIS wajib diisi');
        return;
    }

    try {
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, nis, class_id })
        });

        if (!res.ok) {
            throw new Error('Gagal menambah siswa');
        }

        loadStudents();
    } catch (error) {
        console.error('Add student error:', error);
    }
}

async function deleteStudent(id) {
    try {
        const res = await fetch('/api/students/' + id, {
            method: 'DELETE'
        });

        if (!res.ok) {
            throw new Error('Gagal menghapus siswa');
        }

        loadStudents();
    } catch (error) {
        console.error('Delete student error:', error);
    }
}

loadStudents();