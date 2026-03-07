const db = require("../config/db");

// Basic dashboard (total counts)
exports.getDashboard = (req, res) => {
  const data = {};

  db.query("SELECT COUNT(*) AS totalProducts FROM products", (err, prod) => {
    if (err) return res.status(500).json(err);
    data.totalProducts = prod[0].totalProducts;

    db.query(
      "SELECT COUNT(*) AS totalCustomers FROM customers",
      (err, cust) => {
        if (err) return res.status(500).json(err);
        data.totalCustomers = cust[0].totalCustomers;

        db.query("SELECT COUNT(*) AS totalOrders FROM sales", (err, ord) => {
          if (err) return res.status(500).json(err);
          data.totalOrders = ord[0].totalOrders;

          db.query(
            "SELECT SUM(total_amount) AS totalSales FROM sales",
            (err, sales) => {
              if (err) return res.status(500).json(err);
              data.totalSales = sales[0].totalSales || 0;
              return res.json(data);
            },
          );
        });
      },
    );
  });
};

// Monthly sales
exports.getMonthlySales = (req, res) => {
  const sql = `
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
           SUM(total_amount) AS sales
    FROM sales
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
};

// Daily sales
exports.getDailySales = (req, res) => {
  const sql = `
    SELECT DATE(created_at) AS date,
           SUM(total_amount) AS sales
    FROM sales
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) DESC
    LIMIT 30
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
};

// Customer purchase history
exports.getCustomerHistory = (req, res) => {
  const customerId = req.params.customerId;
  const sql = `
    SELECT o.id AS order_id,
           o.order_date,
           o.total_amount,
           oi.product_id,
           p.name AS product_name,
           oi.quantity,
           oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
  `;
  db.query(sql, [customerId], (err, results) => {
    if (err) return res.status(500).json(err);

    const history = {};
    results.forEach((row) => {
      if (!history[row.order_id]) {
        history[row.order_id] = {
          order_id: row.order_id,
          order_date: row.order_date,
          total_amount: row.total_amount,
          items: [],
        };
      }
      history[row.order_id].items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price,
      });
    });

    return res.json(Object.values(history));
  });
};
