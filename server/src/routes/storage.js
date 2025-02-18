const express = require("express");
const router = express.Router();
const storageController = require("../controllers/storage");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorizate");

router.get("/access", [authenticate, authorize], storageController.accessURL);
router.get(
  "/upload/:type",
  [authenticate, authorize],
  storageController.uploadURL
);
router.delete(
  "/delete",
  [authenticate, authorize],
  storageController.deleteURL
);

module.exports = router;
