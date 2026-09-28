// Muaraversa School Core CRUD Service

export async function listRecords(db, table) {
  const result = await db.prepare(`SELECT * FROM ${table}`).all();
  return result.results || [];
}

export async function createRecord(db, table, data) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => '?').join(', ');

  await db.prepare(
    `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
  ).bind(...values).run();

  return { success: true };
}

export async function deleteRecord(db, table, id) {
  await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
  return { success: true };
}
