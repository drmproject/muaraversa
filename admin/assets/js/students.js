const API = '/api/students';

let studentProcessing = false;

async function requestJson(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
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

async function loadStudents() {
    const list = document.getElementById('studentList');
    if (!list) return;

    list.innerHTML = '<tr><td colspan="4">Memuat data siswa...</td></tr>';

    try {
        const data = await requestJson(API);
        const students = Array.isArray(data.students) ? data.students : [];

        list.innerHTML = students.length ? students.map((student) => `
            <tr>
                <td>${escapeHtml(student.name || '-')}</td>
                <td>${escapeHtml(student.nis || '-')}</td>
                <td>${escapeHtml(student.class_id || '-')}</td>
                <td>
                    <button type="button" onclick="deleteStudent(${Number(student.id) || 0})">Hapus</button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="4">Belum ada data siswa</td></tr>';

    } catch (error) {
        console.error(error);
        list.innerHTML = '<tr><td colspan="4">Gagal memuat data siswa</td></tr>';
    }
}

async function addStudent() {
    if (studentProcessing) return;

    const name = document.getElementById('name')?.value.trim();
    const nis = document.getElementById('nis')?.value.trim();
    const class_id = document.getElementById('class_id')?.value.trim();

    if (!name || !nis) {
        alert('Nama dan NIS wajib diisi');
        return;
    }

    studentProcessing = true;

    try {
        await requestJson(API, {
            method: 'POST',
            body: JSON.stringify({ name, nis, class_id })
        });

        await loadStudents();
    } catch (error) {
        alert(error.message);
    } finally {
        studentProcessing = false;
    }
}

async function deleteStudent(id) {
    if (!id || !confirm('Hapus data siswa ini?')) return;

    try {
        await requestJson(`${API}/${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });

        await loadStudents();
    } catch (error) {
        alert(error.message);
    }
}

loadStudents();
