const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const listSubmissions = require("../controllers/csv");
router.get("/csv", authenticate, listSubmissions);

module.exports = router;
