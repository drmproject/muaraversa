export async function getSchools(db) {
  const { results } = await db.prepare('SELECT * FROM schools').all();
  return results;
}

export async function getTeachers(db) {
  const { results } = await db.prepare('SELECT * FROM teachers').all();
  return results;
}

export async function getStudents(db) {
  const { results } = await db.prepare('SELECT * FROM students').all();
  return results;
}

export async function getClasses(db) {
  const { results } = await db.prepare('SELECT * FROM classes').all();
  return results;
}
