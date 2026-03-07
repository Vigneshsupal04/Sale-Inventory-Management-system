const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

console.log("Auth routes loaded");

router.post("/register", (req, res) => {
  console.log("Register API hit");
  registerUser(req, res);
});

router.post("/login", (req, res) => {
  console.log("Login API hit");
  loginUser(req, res);
});

module.exports = router;
