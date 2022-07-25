import connection from "../dbStartegy/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  const { customerId, gameId, offset, limit, order } = req.query;
  let paramsClause = "";
  let orderClause = "";
  let offsetClause = "";
  let limitClause = "";

  try {
    customerId
      ? (paramsClause = `WHERE rentals."customerId" = ${customerId}`)
      : "";
    gameId ? (paramsClause = `WHERE rentals."gameId" = ${gameId}`) : "";
    order ? (orderClause = `ORDER BY "${order}" ASC`) : "";
    offset ? (offsetClause = `OFFSET ${offset}`) : "";
    limit ? (limitClause = `LIMIT ${limit}`) : "";

    const { rows: rentals } = await connection.query(
      `
        SELECT 
            rentals.*, 
            to_json(customers) "customer", 
            to_json(games) "game"
        FROM rentals 
            INNER JOIN customers ON customers.id = rentals."customerId" 
            INNER JOIN (SELECT 
                    games.*, 
                    categories.name as "categoryName" 
                FROM games 
                    JOIN categories ON games."categoryId" = categories.id) 
                AS games
            ON games.id = rentals."gameId" 
        ${paramsClause}
        ${orderClause}
        ${offsetClause}
        ${limitClause}
           ;
        `
    );
    if (rentals.length !== 0) {
      delete rentals[0].customer.phone;
      delete rentals[0].customer.cpf;
      delete rentals[0].customer.birthday;
      delete rentals[0].game.image;
      delete rentals[0].game.stockTotal;
      delete rentals[0].game.pricePerDay;
    }

    return res.send(rentals);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function addRental(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;

    const returnDate = null;
    const delayFee = null;
    const rentDate = dayjs().format("YYYY-MM-DD");

    const { rows: games } = await connection.query(
      `SELECT * FROM games WHERE id = ${gameId};`
    );

    const originalPrice = daysRented * games[0].pricePerDay;

    const { rows: rentalsGame } = await connection.query(
      `SELECT * FROM rentals WHERE "gameId" = $1;`,
      [gameId]
    );

    if (rentalsGame.length + 1 > games[0].stockTotal) {
      console.log(rentalsGame.length);
      console.log(games[0].stockTotal);
      console.log("nao da");
      return res.sendStatus(400);
    }
    console.log(rentalsGame.length + 1);
    console.log(games[0].stockTotal);

    await connection.query(
      `INSERT INTO rentals (
          "customerId", 
          "gameId", 
          "daysRented", 
          "returnDate", 
          "delayFee",
          "rentDate", 
          "originalPrice") 
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        customerId,
        gameId,
        daysRented,
        returnDate,
        delayFee,
        rentDate,
        originalPrice,
      ]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function finishRental(req, res) {
  const { id } = req.params;

  try {
    const returnDate = dayjs().format("YYYY-MM-DD");
    const dayNow = dayjs(returnDate);
    let delayFee = 0;

    const { rows: rentals } = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );
    const { rentDate, daysRented, gameId } = rentals[0];

    const { rows: game } = await connection.query(
      `SELECT * FROM games WHERE id = ${gameId};`
    );
    const { pricePerDay } = game[0];

    const diffDays = dayNow.diff(rentDate, "days");

    if (diffDays > daysRented) {
      const diffDaysFee = diffDays - daysRented;
      delayFee = diffDaysFee * pricePerDay;
    }

    await connection.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`,
      [returnDate, delayFee, id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}