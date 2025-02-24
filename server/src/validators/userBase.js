const Joi = require("joi");
const phoneValidator = require("../utils/phoneValidator");

const username = Joi.string().alphanum().required();
const password = Joi.string().min(8).required();
const email = Joi.string().email().required();
const phoneNumber = Joi.string()
  .empty("")
  .allow(null)
  .replace(/[^\d+]/g, "")
  .custom(phoneValidator);
const name = Joi.string().max(30);
const isAdmin = Joi.boolean();
module.exports = { username, password, email, phoneNumber, name, isAdmin };
