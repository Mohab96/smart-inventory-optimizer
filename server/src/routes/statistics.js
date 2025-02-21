const statisticsRouter = require("express").Router();
const { categoryRevenueController } = require("../controllers/categoryRevenue");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorizate");
const getProdcutsRevenues = require("../controllers/productsRevenues");
const getProductsStock = require("../controllers/productsStock");
const getMonthlyCategoryRevenues = require("../controllers/MonthlyCategoryRevenues");
const getProductsExpiringSoon = require("../controllers/productsExpiringSoon");

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
  "/monthly-category-revenues",
  [authenticate, authorize],
  getMonthlyCategoryRevenues
);
statisticsRouter.get(
  "/products-expiringsoon",
  [authenticate, authorize],
  getProductsExpiringSoon
);
module.exports = statisticsRouter;
