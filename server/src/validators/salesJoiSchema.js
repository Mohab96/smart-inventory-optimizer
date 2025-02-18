const Joi = require("joi");
const {
  salesTransactionValidator,
} = require("../utils/customSaleJoiValidator");

const salesSchema = Joi.object({
  batchId: Joi.number().required().messages({
    "any.required": "Batch ID is required.",
    "number.base": "Batch ID must be a number.",
  }),
  productName: Joi.string().required().messages({
    "any.required": "Product Name is required.",
  }),
  amount: Joi.number().positive().required().messages({
    "any.required": "Amount is required.",
    "number.base": "Amount must be a number.",
    "number.positive": "Amount must be a positive number.",
  }),
  date: Joi.date().max("now").required().messages({
    "any.required": "Date is required.",
    "date.base": "Date must be a valid date.",
    "date.max": "Date must be in the past.",
  }),
  discount: Joi.number().min(0).max(100).required().messages({
    "any.required": "Discount is required.",
    "number.base": "Discount must be a number.",
    "number.min": "Discount must be at least 0.",
    "number.max": "Discount must be at most 100.",
  }),
}).external(salesTransactionValidator);

module.exports = salesSchema;
