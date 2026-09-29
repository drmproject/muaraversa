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

        (Array.isArray(data.students) ? data.students : []).forEach((student) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${escapeHtml(student.name || '-')}</td>
                <td>${escapeHtml(student.nis || '-')}</td>
                <td>${escapeHtml(student.class_id || '-')}</td>
                <td>
                    <button type="button" data-id="${Number(student.id) || 0}" class="delete-student-btn">Hapus</button>
                </td>
            `;

            list.appendChild(row);
        });

        document.querySelectorAll('.delete-student-btn').forEach((button) => {
            button.addEventListener('click', () => deleteStudent(button.dataset.id));
        });

    } catch (error) {
        console.error('Students load error:', error);
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

async function addStudent() {
    const name = document.getElementById('name')?.value.trim();
    const nis = document.getElementById('nis')?.value.trim();
    const class_id = document.getElementById('class_id')?.value.trim();

    if (!name || !nis) {
        alert('Nama dan NIS wajib diisi');
        return;
    }

    if (nis.length < 3) {
        alert('NIS tidak valid');
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
    if (!id || Number(id) <= 0) return;

    if (!confirm('Hapus data siswa ini?')) return;

    try {
        const res = await fetch('/api/students/' + encodeURIComponent(id), {
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