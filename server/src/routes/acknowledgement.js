const acknowledgementRouter = require("express").Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorizate");
const acknowledgementController = require("../controllers/acknowledgementController");

acknowledgementRouter.post(
  "/",
  [authenticate, authorize],
  acknowledgementController
);

module.exports = acknowledgementRouter;
