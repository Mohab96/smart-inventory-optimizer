const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const lowstockController = require("../controllers/lowStockPrediction");
const ProductsPredictionController = require("../controllers/ProductsPrediction");

router.get(
  "/low-stock",
  [authenticate],
  lowstockController.getLowStockPrediction
);
router.get(
  "/products-prediction",
  [authenticate],
  ProductsPredictionController.getPrediction
);
module.exports = router;
