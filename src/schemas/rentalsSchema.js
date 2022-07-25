import joi from "joi";

export const rentalsSchema = joi.object({
  daysRented: joi.number().positive().required(),
  gameId: joi.number().required(),
  customerId: joi.number().required(),
});