const categoriesRouter = require("express").Router();

const listCategories = require("../controllers/listCategories");

categoriesRouter.get("/", listCategories);

module.exports = categoriesRouter;
