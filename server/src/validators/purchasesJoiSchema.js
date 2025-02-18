const Joi = require("joi");
const {
  isPresent,
  checkUniqueness,
} = require("../utils/customPurchaseJoiValidator");

const purchasesSchema = Joi.object({
  batchId: Joi.number().required().messages({
    "any.required": "Batch ID is required.",
    "number.base": "Batch ID must be a number.",
  }),

  productName: Joi.string().required().custom(isPresent).messages({
    "any.required": "Product Name is required.",
    "number.base": "Product Name must be a number.",
    "any.custom": "Product not found.",
  }),

  quantity: Joi.number().positive().required().messages({
    "any.required": "Quantity is required.",
    "number.base": "Quantity must be a number.",
    "number.positive": "Quantity must be a positive number.",
  }),

  expiryDate: Joi.date().min("now").required().messages({
    "any.required": "Expiry Date is required.",
    "date.base": "Expiry Date must be a valid date.",
    "date.min": "Expiry Date must be in the future.",
  }),

  sellingPrice: Joi.number()
    .positive()
    .greater(Joi.ref("costOfGoods"))
    .required()
    .messages({
      "any.required": "Selling Price is required.",
      "number.base": "Selling Price must be a number.",
      "number.positive": "Selling Price must be a positive number.",
      "number.greater": "Selling Price must be greater than Cost of Goods.",
    }),

  costOfGoods: Joi.number().positive().required().messages({
    "any.required": "Cost of Goods is required.",
    "number.base": "Cost of Goods must be a number.",
    "number.positive": "Cost of Goods must be a positive number.",
  }),

  dateOfReceipt: Joi.date().max("now").required().messages({
    "any.required": "Date of Receipt is required.",
    "date.base": "Date of Receipt must be a valid date.",
    "date.max": "Date of Receipt cannot be in the future.",
  }),
})
  .external(checkUniqueness)
  .messages({
    "any.custom": "batchId and productId combination already exists.",
  });

module.exports = purchasesSchema;
