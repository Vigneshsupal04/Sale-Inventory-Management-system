const express = require("express");
const router = express.Router();
const { createSale } = require("../controllers/salesController");
const { getAllSales } = require("../controllers/salesController");

router.get("/", getAllSales);
router.post("/", createSale);
module.exports = router;
