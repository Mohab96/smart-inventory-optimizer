const statisticsRouter = require("express").Router();
const { categoryRevenueController } = require("../controllers/categoryRevenue");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorizate");
const getProdcutsRevenues = require("../controllers/productsRevenues");
const getProductsStock = require("../controllers/productsStock");
const productsSalesController = require("../controllers/products-sales");
const categorySalesController = require("../controllers/category-sales");
const getMonthlyCategoryRevenues = require("../controllers/monthlyCategoryRevenues");
const getProductsExpiringSoon = require("../controllers/productsExpiringSoon");
const getCategoriesExpiringSoon = require("../controllers/CategoriesExpiringSoon");

statisticsRouter.get(
  "/category-revenue",
  [authenticate, authorize],
  categoryRevenueController
);

statisticsRouter.get(
  "/products-revenues",
  [authenticate, authorize],
  getProdcutsRevenues
);

statisticsRouter.get(
  "/products-stock",
  [authenticate, authorize],
  getProductsStock
);

statisticsRouter.get(
  "/products-sales",
  [authenticate, authorize],
  productsSalesController
); // top sales products

statisticsRouter.get(
  "/category-sales",
  [authenticate, authorize],
  categorySalesController
); // top sales categories

statisticsRouter.get(
  "/monthly-category-revenues",
  [authenticate, authorize],
  getMonthlyCategoryRevenues
);

statisticsRouter.get(
  "/products-expiringsoon",
  [authenticate, authorize],
  getProductsExpiringSoon
);

statisticsRouter.get(
  "/categories-expiringsoon",
  [authenticate, authorize],
  getCategoriesExpiringSoon
);

module.exports = statisticsRouter;
