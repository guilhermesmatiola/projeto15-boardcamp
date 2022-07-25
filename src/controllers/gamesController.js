import connection from "../dbStartegy/postgres.js";

export async function getGames(req, res) {
  const { name, offset, limit, order } = req.query;
  let findByName = "";
  let orderClause = "";
  let offsetClause = "";
  let limitClause = "";

  try {
    name ? (findByName = `WHERE games.name ILIKE '${name}%'`) : "";
    order ? (orderClause = `ORDER BY "${order}" ASC`) : "";
    offset ? (offsetClause = `OFFSET ${offset}`) : "";
    limit ? (limitClause = `LIMIT ${limit}`) : "";

    const { rows: games } = await connection.query(
      `SELECT 
        games.*, 
        categories.name as "categoryName" 
      FROM games 
      JOIN categories 
      ON games."categoryId" = categories.id 
      ${findByName}
      ${orderClause}
      ${offsetClause}
      ${limitClause};
      `
    );

    return res.send(games);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function addGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await connection.query(
      `INSERT INTO games (
          name, 
          image, 
          "stockTotal", 
          "categoryId",
          "pricePerDay") 
        VALUES ($1, $2, $3, $4, $5);`,
      [name, image, Number(stockTotal), categoryId, Number(pricePerDay)]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}