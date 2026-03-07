const express = require("express");
const router = express.Router();
const { getInvoiceBySaleId } = require("../controllers/invoiceController");

router.get("/:saleId", getInvoiceBySaleId);

module.exports = router;
