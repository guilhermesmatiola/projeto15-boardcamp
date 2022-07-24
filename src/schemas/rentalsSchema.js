import joi from "joi";

export const rentalsSchema = joi.object({
  daysRented: joi.number().required(),
  gameId: joi.number().required(),
  customerId: joi.number().required(),
});