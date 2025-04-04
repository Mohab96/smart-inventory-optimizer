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
const getCategoriesExpiringSoon = require("../controllers/categoriesExpiringSoon");
const yearlyRevenuePerCategory = require("../controllers/yearlyRevenuePerCategory");
const yearlyRevenuePerMonth = require("../controllers/yearlyRevenuePerMonth");
const getTotalRevenueByYear = require("../controllers/totalRevenueByYear");
const getTotalRevenueByQuarter = require("../controllers/totalRevenueByQuarter");
const getTransactionHistory = require("../controllers/getTransactionHistory");
const productTrendController = require("../controllers/productsTrend");

statisticsRouter.get(
  "/products-trend/:year",
  [authenticate, authorize],
  productTrendController
);

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

statisticsRouter.get(
  "/yearly-revenue-per-category",
  [authenticate],
  yearlyRevenuePerCategory
);

statisticsRouter.get(
  "/yearly-revenue-per-month",
  [authenticate],
  yearlyRevenuePerMonth
);
statisticsRouter.get(
  "/total-revenue-per-year",
  [authenticate, authorize],
  getTotalRevenueByYear
);
statisticsRouter.get(
  "/total-revenue-per-quarter",
  [authenticate, authorize],
  getTotalRevenueByQuarter
);

statisticsRouter.get(
  "/transactions",
  [authenticate, authorize],
  getTransactionHistory
);

module.exports = statisticsRouter;
