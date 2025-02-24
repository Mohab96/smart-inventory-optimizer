const express = require("express");
const productsRouter = express.Router();
const authenticate = require("../middlewares/authenticate");
const createProduct = require("../controllers/createProduct");

productsRouter.post("/", [authenticate], createProduct);

module.exports = productsRouter;
