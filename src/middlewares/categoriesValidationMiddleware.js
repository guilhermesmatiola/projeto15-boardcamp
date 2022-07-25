import { categoriesSchema } from "../schemas/categoriesSchema.js";
import connection from "../dbStartegy/postgres.js";

export async function ValidateCategory(req, res, next) {
  const validation = categoriesSchema.validate(req.body, { abortEarly: false });
  const { name } = req.body;

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  const { rows: categoryExist } = await connection.query(
    "SELECT * FROM categories WHERE name = $1;",
    [name]
  );

  if (categoryExist.length !== 0) {
    return res.sendStatus(409);
  }

  next();
}
