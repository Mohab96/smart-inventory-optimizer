const express = require("express");
const productsRouter = express.Router();
const authenticate = require("../middlewares/authenticate");
const validateRequest = require("../middlewares/validateSchema");

const createProduct = require("../controllers/createProduct");

const productSchema = require("../validators/createProductValidator");

productsRouter.post(
  "/",
  authenticate,
  validateRequest(productSchema),
  createProduct
);

module.exports = productsRouter;
