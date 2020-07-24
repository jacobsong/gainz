const getItem = async (db, itemId) => {
  return await db.get(`SELECT inStock FROM items WHERE itemId = ${itemId}`);
}

const insertItem = async (db, itemId, inStock) => {
  return await db.run(`INSERT INTO items (itemId, inStock) VALUES (${itemId}, ${inStock})`);
}

const updateItem = async (db, itemId, inStock) => {
  return await db.run(`UPDATE items SET inStock = ${inStock} WHERE itemId = ${itemId}`);
}

module.exports = {
  getItem,
  insertItem,
  updateItem
}