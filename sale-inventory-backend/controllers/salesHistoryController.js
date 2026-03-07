const db = require("../config/db");

exports.getSalesHistory = (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.invoice_no,
      s.total_amount,
      s.created_at,
      c.name AS customer_name
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.id
    ORDER BY s.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("SALES HISTORY ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};