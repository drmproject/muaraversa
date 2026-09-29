async function loadStudents() {
    try {
        const res = await fetch('/api/students');

        if (!res.ok) {
            throw new Error('Failed loading students');
        }

        const data = await res.json();
        const list = document.getElementById('studentList');

        if (!list) return;

        list.innerHTML = '';

        (data.students || []).forEach((student) => {
            list.innerHTML += `
                <tr>
                    <td>${student.name || ''}</td>
                    <td>${student.nis || ''}</td>
                    <td>${student.class_id || ''}</td>
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
    await fetch('/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.getElementById('name').value,
            nis: document.getElementById('nis').value,
            class_id: document.getElementById('class_id').value
        })
    });

    loadStudents();
}

async function deleteStudent(id) {
    await fetch('/api/students/' + id, {
        method: 'DELETE'
    });

    loadStudents();
}

loadStudents();