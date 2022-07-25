import connection from "../dbStartegy/postgres.js";

export async function getCategories(req, res) {
  const { offset, limit, order } = req.query;
  let orderClause = "";
  let offsetClause = "";
  let limitClause = "";

  try {
    order ? (orderClause = `ORDER BY "${order}" ASC`) : "";
    offset ? (offsetClause = `OFFSET ${offset}`) : "";
    limit ? (limitClause = `LIMIT ${limit}`) : "";

    const { rows: categories } = await connection.query(
      `SELECT * FROM categories
      ${orderClause}
      ${offsetClause}
      ${limitClause}
      ;`
    );

    res.send(categories);
  } catch {
    res.sendStatus(500);
  }
}
//////////////////////////////////////////////////////////
export async function addCategory(req, res) {
  const { name } = req.body;

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1);", [
      name,
    ]);

    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}