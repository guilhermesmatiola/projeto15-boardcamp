import joi from "joi";

export const customerSchema = joi.object({
  name: joi.string().required(),
  cpf: joi.string().length(11).required(),
  phone: joi.string().min(10).max(11).required(),
  birthday: joi.date().required().min("1900-01-01").max(Date.now()),
});