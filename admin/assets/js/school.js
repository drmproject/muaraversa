const API = '/api/school';

async function loadSchool() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    const school = data.school || data;
    if (school) {
      if (document.getElementById('name')) document.getElementById('name').value = school.name || '';
      if (document.getElementById('address')) document.getElementById('address').value = school.address || '';
      if (document.getElementById('phone')) document.getElementById('phone').value = school.phone || '';
    }
  } catch (err) {
    console.error('Failed to load school data:', err);
  }
}

document.getElementById('schoolForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name')?.value.trim();
  const address = document.getElementById('address')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const msgEl = document.getElementById('schoolMessage');

  if (msgEl) msgEl.textContent = 'Menyimpan...';

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, phone })
    });

    if (res.ok) {
      if (msgEl) {
        msgEl.textContent = 'Profil sekolah berhasil disimpan!';
        msgEl.style.color = '#16a34a';
      }
    } else {
      throw new Error('Gagal menyimpan');
    }
  } catch (err) {
    if (msgEl) {
      msgEl.textContent = 'Gagal menyimpan profil sekolah.';
      msgEl.style.color = '#dc2626';
    }
  }
});

document.addEventListener('DOMContentLoaded', loadSchool);
