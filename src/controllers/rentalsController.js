import connection from "../dbStartegy/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;
  let findByParams = "";

  try {
    if (customerId) {
      findByParams = `WHERE rentals."customerId" = ${customerId}`;
    }

    if (gameId) {
      findByParams = `WHERE rentals."gameId" = ${gameId}`;
    }

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
        ${findByParams}
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

    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "daysRented", "returnDate", "delayFee","rentDate", "originalPrice") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
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
