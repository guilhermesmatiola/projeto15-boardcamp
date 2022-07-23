import connection from "../dbStartegy/postgres.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    if (cpf) {
      const { rows: customers } = await connection.query(
        `SELECT * FROM customers WHERE cpf ILIKE '${cpf}%';`
      );
      return res.send(customers);
    } else {
      const { rows: customers } = await connection.query(
        `SELECT * FROM customers;`
      );
      return res.send(customers);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getCustomer(req, res) {
  const { id } = req.params;

  try {
    const { rows: customer } = await connection.query(
      `SELECT * FROM customers WHERE id = $1;`,
      [id]
    );

    if (customer.length === 0) {
      return res.sendStatus(404);
    }

    return res.send(customer);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function addCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const { rows: cpfExist } = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [cpf]
    );

    if (cpfExist.length !== 0) {
      return res.sendStatus(409);
    }

    await connection.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updateCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  try {
    const { rows: cpfExist } = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [cpf]
    );

    if (cpfExist.length !== 0) {
      return res.sendStatus(409);
    }

    await connection.query(
      `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5`,
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}