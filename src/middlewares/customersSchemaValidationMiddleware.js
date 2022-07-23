import { customerSchema } from "../schemas/customersSchema.js";

export async function ValidateCustomer(req, res, next) {
  const validation = customerSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  next();
}