const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// login, register api
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// product api
const productRoutes = require("./routes/product");
app.use("/api/products", productRoutes);

// customer api
const customerRoutes = require("./routes/customer");
app.use("/api/customer", customerRoutes);

// order api
const orderRoutes = require("./routes/order");
app.use("/api/orders", orderRoutes);

// dashboard api
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

// sales api
app.use("/api/sales", require("./routes/sales"));

//invoice api
app.use("/api/invoice", require("./routes/invoice"));

app.get("/", (req, res) => {
  res.send("Backend + DB running");
});

module.exports = app;
