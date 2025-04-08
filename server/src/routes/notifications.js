const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const lowstockController = require("../controllers/lowStockPrediction");

router.get(
  "/low-stock",
  [authenticate],
  lowstockController.getLowStockPrediction
);
module.exports = router;
