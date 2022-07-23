import joi from "joi";

export const categoriesSchema = joi.object({
  name: joi.string().required(),
});