const Joi = require("joi");
//TODO: these constrains are arbitary so fix them
const businessSchema = Joi.object({
  name: Joi.string().max(30).required(),
  establishmentDate: Joi.date().max("now").required(),
  description: Joi.string(),
});

module.exports = businessSchema;
