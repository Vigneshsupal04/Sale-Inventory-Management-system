const db = require("../config/db");

// CREATE ORDER
exports.createOrder = (req, res) => {
  const { customer_id, order_date, items } = req.body;

  let total_amount = 0;
  items.forEach((item) => {
    total_amount += item.price * item.quantity;
  });

  //  Save order in `orders` table
  db.query(
    "INSERT INTO orders (customer_id, total_amount, order_date) VALUES (?, ?, ?)",
    [customer_id, total_amount, order_date],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const orderId = result.insertId;

      //  Save order items
      items.forEach((item) => {
        db.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, item.product_id, item.quantity, item.price],
          (err) => {
            if (err) return res.status(500).json(err);
          },
        );
      });

      return res.status(201).json({ msg: "Order created", orderId });
    },
  );
};

// GET ALL ORDERS
exports.getOrders = (req, res) => {
  const sql = `
    SELECT o.id, o.customer_id, c.name AS customer_name,
           o.total_amount, o.order_date
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    ORDER BY o.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// GET SINGLE ORDER
exports.getOrderById = (req, res) => {
  const id = req.params.id;

  const orderSql = `
    SELECT o.id, o.customer_id, c.name AS customer_name,
           o.total_amount, o.order_date
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `;
  db.query(orderSql, [id], (err, orderData) => {
    if (err) return res.status(500).json(err);
    if (orderData.length === 0)
      return res.status(404).json({ msg: "Order not found" });

    db.query(
      "SELECT oi.id, oi.product_id, p.name AS product_name, oi.quantity, oi.price FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?",
      [id],
      (err, items) => {
        if (err) return res.status(500).json(err);

        res.json({
          ...orderData[0],
          items,
        });
      },
    );
  });
};
