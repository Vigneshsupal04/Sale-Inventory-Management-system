const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("SQL SELECT error:", err);
          return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
          return res.status(400).json({ msg: "User already exists" });
        }

        // hash password
        const hashedPwd = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [name, email, hashedPwd, role || "user"],
          (err, result) => {
            if (err) {
              console.error("SQL INSERT error:", err);
              return res.status(500).json({ error: err.message });
            }
            return res.status(201).json({ msg: "User registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("SQL SELECT error:", err);
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          return res.status(400).json({ msg: "User not found" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.status(200).json({
          msg: "Login successful",
          token: token,
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
      }
    );
  } catch (error) {
    console.error("Unexpected login error:", error);
    return res.status(500).json({ error: error.message });
  }
};
