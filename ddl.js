const createTables = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS items (
    itemId TEXT PRIMARY KEY,
    inStock TEXT
  )`;

  return await db.exec(sql);
}

module.exports = createTables;