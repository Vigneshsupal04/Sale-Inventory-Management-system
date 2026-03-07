const db = require("../config/db");

// CREATE
exports.createProduct = (req, res) => {
  const { name, description, price, stock_quantity, category, hsn_code } =
    req.body;

  db.query(
    "INSERT INTO products (name, description, price, stock_quantity, category, hsn_code) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, price, stock_quantity, category, hsn_code],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res
        .status(201)
        .json({
          msg: "Product created successfully",
          productId: result.insertId,
        });
    },
  );
};

// READ (all products)
exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// READ (single product)
exports.getProductById = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ msg: "Product not found" });
    res.json(results[0]);
  });
};

// UPDATE
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, description, price, stock_quantity, category, hsn_code } =
    req.body;

  db.query(
    "UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category = ?, hsn_code = ? WHERE id = ?",
    [name, description, price, stock_quantity, category, hsn_code, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Product updated successfully" });
    },
  );
};

// DELETE
exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Product deleted successfully" });
  });
};
