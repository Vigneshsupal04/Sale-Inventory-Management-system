const express = require("express");
const router = express.Router();
const { getSalesHistory } = require("../controllers/salesHistoryController");

router.get("/", getSalesHistory);

module.exports = router;
