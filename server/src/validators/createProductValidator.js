const joi = require("joi");

const productSchema = joi.object({
  name: joi.string().required(),
  categoryId: joi.number().optional(),
});

module.exports = productSchema;
