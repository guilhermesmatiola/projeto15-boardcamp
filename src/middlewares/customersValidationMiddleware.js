import { customerSchema } from "../schemas/customersSchema.js";
import connection from "../dbStartegy/postgres.js";

export async function ValidateCustomer(req, res, next) {
  const validation = customerSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  const { rows: cpfExist } = await connection.query(
    "SELECT * FROM customers WHERE cpf = $1;",
    [req.body.cpf]
  );

  if (cpfExist.length !== 0) {
    return res.sendStatus(409);
  }

  next();
}

export async function ValidateGetCustomer(req, res, next) {
  const { id } = req.params;
  const { rows: customer } = await connection.query(
    `SELECT * FROM customers WHERE id = $1;`,
    [id]
  );

  if (customer.length === 0) {
    return res.sendStatus(404);
  }

  res.locals.customer = customer;
  next();
}
