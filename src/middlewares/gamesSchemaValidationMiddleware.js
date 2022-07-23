import { gamesSchema } from "../schemas/gamesSchema.js";

export async function ValidateGame(req, res, next) {
  const validation = gamesSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  next();
}