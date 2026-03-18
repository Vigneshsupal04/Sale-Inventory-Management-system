const db = require ("../config/db");

// CREATE
exports.createCustomer = (req, res) => {
  const { name, phone, address } = req.body;

  db.query(
    "INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)",
    [name, phone, address],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res
        .status(201)
        .json({
          msg: "Customer added successfully",
          customerId: result.insertId,
        });
    },
  );
};

// READ all
exports.getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customers");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one
exports.getCustomerById = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM customers WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ msg: "Customer not found" });
    res.json(results[0]);
  });
};

// UPDATE
exports.updateCustomer = (req, res) => {
  const id = req.params.id;
  const { name, phone, address } = req.body;

  db.query(
    "UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?",
    [name, phone, address, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ msg: "Customer updated successfully" });
    },
  );
};

// DELETE
exports.deleteCustomer = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM customers WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Customer deleted successfully" });
  });
};
