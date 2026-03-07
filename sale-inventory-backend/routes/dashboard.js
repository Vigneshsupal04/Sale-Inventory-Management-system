const express = require("express");
const {
  getDashboard,
  getMonthlySales,
  getDailySales,
  getCustomerHistory,
} = require("../controllers/dashboardController");

const router = express.Router();

// Basic summary
router.get("/", getDashboard);

// Advanced analytics
router.get("/monthly-sales", getMonthlySales);
router.get("/daily-sales", getDailySales);
router.get("/customer-history/:customerId", getCustomerHistory);

module.exports = router;
