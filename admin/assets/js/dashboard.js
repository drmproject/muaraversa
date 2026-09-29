const API = "";

async function loadDashboard() {
  const elements = {
    teachers: document.getElementById("teachers"),
    students: document.getElementById("students"),
    classes: document.getElementById("classes"),
    school: document.getElementById("school")
  };

  Object.values(elements).forEach((element) => {
    if (element) element.textContent = "Loading...";
  });

  try {
    const response = await fetch(API + "/api/dashboard", {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Dashboard API gagal dimuat");
    }

    const data = await response.json();

    if (elements.teachers) elements.teachers.textContent = data.total_guru ?? 0;
    if (elements.students) elements.students.textContent = data.total_siswa ?? 0;
    if (elements.classes) elements.classes.textContent = data.total_kelas ?? 0;
    if (elements.school) elements.school.textContent = data.sekolah?.name ?? "-";

  } catch (error) {
    console.error("Dashboard API error:", error.message);

    if (elements.teachers) elements.teachers.textContent = "0";
    if (elements.students) elements.students.textContent = "0";
    if (elements.classes) elements.classes.textContent = "0";
    if (elements.school) elements.school.textContent = "Offline";
  }
}

loadDashboard();
