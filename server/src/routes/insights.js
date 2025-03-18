const insightsRouter = require("express").Router();
const insightsController = require("../controllers/insights");
const authenticate = require("../middlewares/authenticate");

insightsRouter.get(
  "/get-insights",
  [authenticate],
  insightsController.getInsights
);

module.exports = insightsRouter;
