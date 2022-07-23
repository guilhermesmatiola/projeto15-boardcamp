import { categoriesSchema } from "../schemas/categoriesSchema.js";

export async function ValidateCategory(req, res, next) {
  const validation = categoriesSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  next();
}