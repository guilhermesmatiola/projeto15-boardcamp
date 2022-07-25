import { rentalsSchema } from "../schemas/rentalsSchema.js";
import connection from "../dbStartegy/postgres.js";

export async function ValidateRental(req, res, next) {
  const validation = rentalsSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  const { rows: customerExist } = await connection.query(
    "SELECT * FROM customers WHERE id = $1;",
    [req.body.customerId]
  );

  const { rows: gameExist } = await connection.query(
    "SELECT * FROM games WHERE id = $1;",
    [req.body.gameId]
  );

  if (customerExist.length === 0 || gameExist.length === 0) {
    return res.sendStatus(400);
  }

  next();
}

export async function ValidateDeleteRental(req, res, next) {
  const { id } = req.params;

  const { rows: rentalExist } = await connection.query(
    "SELECT * FROM rentals WHERE id = $1;",
    [id]
  );

  const { rows: rentalFinished } = await connection.query(
    `SELECT rentals."returnDate" FROM rentals WHERE id = $1;`,
    [id]
  );

  if (rentalExist.length === 0 || rentalFinished[0].returnDate === null) {
    return res.sendStatus(400);
  }

  next();
}
