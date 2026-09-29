const API = "";

async function loadDashboard() {
  try {
    const response = await fetch(API + "/api/dashboard");

    if (!response.ok) {
      throw new Error("Dashboard API gagal dimuat");
    }

    const data = await response.json();

    const teachers = document.getElementById("teachers");
    const students = document.getElementById("students");
    const classes = document.getElementById("classes");
    const school = document.getElementById("school");

    if (teachers) teachers.textContent = data.total_guru ?? 0;
    if (students) students.textContent = data.total_siswa ?? 0;
    if (classes) classes.textContent = data.total_kelas ?? 0;
    if (school) school.textContent = data.sekolah?.name ?? "-";

  } catch (error) {
    console.error("Dashboard API error:", error.message);
  }
}

loadDashboard();
